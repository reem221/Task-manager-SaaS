import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemRole } from 'src/common/enums/roles.enum';
import { SYSTEM_ROLES_KEY } from '../decorators/system-roles.decorator';

@Injectable()
export class SystemRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(SYSTEM_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.systemRole) {
      return false;
    }

    const hasRole = requiredRoles.includes(user.systemRole);

    if (!hasRole) {
      throw new ForbiddenException('Access denied: System Admin only');
    }

    return true;
  }
}