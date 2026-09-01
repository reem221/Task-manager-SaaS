// src/workspace/guards/workspace-roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Membership, WorkspaceRole } from 'src/entity/membership.entity';

@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<WorkspaceRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId; 
    
    const workspaceId = parseInt(request.params.workspaceId || request.body.workspaceId, 10);

    if (!userId || !workspaceId) {
      throw new ForbiddenException('User ID and Workspace ID are required');
    }

    const membership = await this.membershipRepository.findOne({
      where: {
        user: { id: userId },
        workspace: { id: workspaceId },
      },
    });

    if (!membership) {
      throw new ForbiddenException('you are not a member of this workspace');
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(membership.role);
      if (!hasRole) {
        throw new ForbiddenException('you do not have the required permissions to perform this action');
      }
    }

    return true;
  }
}