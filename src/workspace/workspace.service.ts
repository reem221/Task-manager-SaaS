import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { KanbanColumn } from 'src/column/column.entity';
import { Membership } from './membership.entity';
import { User } from 'src/user/user.entity';
import { Workspace } from './workspace.entity';
import { WorkspaceRole } from 'src/common/enums/roles.enum';
import { Project } from 'src/project/project.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: number): Promise<Workspace> {
  const { name, description } = createWorkspaceDto;

  const workspace = this.workspaceRepository.create({
    name,
    description,
    owner: { id: userId } as any,
  });
  const savedWorkspace = await this.workspaceRepository.save(workspace);

  const membership = this.membershipRepository.create({
    role: WorkspaceRole.OWNER,
    user: { id: userId } as any,
    workspace: savedWorkspace,
  });
  await this.membershipRepository.save(membership);

  return savedWorkspace;
  }  

  async findAllForUser(userId: number): Promise<Workspace[]> {
    const memberships = await this.membershipRepository.find({
      where: { user: { id: String(userId) } },
      relations: ['workspace'], 
    });
    return memberships.map((m) => m.workspace);
  }

  async findOne(workspaceId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members', 'members.user', 'owner', 'projects'],
    });
    if (!workspace) {
      throw new NotFoundException('this workspace does not exist');
    }
    return workspace;
  }

  async update(workspaceId: string, updateDto: Partial<CreateWorkspaceDto>): Promise<Workspace> {
    const workspace = await this.findOne(workspaceId);
    Object.assign(workspace, updateDto);
    return this.workspaceRepository.save(workspace);
  }

  async remove(workspaceId: string): Promise<{ message: string }> {
    const workspace = await this.findOne(workspaceId);
    await this.workspaceRepository.remove(workspace);
    return { message: 'this workspace has been deleted successfully' };
  }

  async addMember(workspaceId: string, email: string): Promise<Membership> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('this email is not registered in the system');
    }

    const existingMembership = await this.membershipRepository.findOne({
      where: { user: { id: user.id }, workspace: { id: workspaceId } },
    });
    if (existingMembership) {
      throw new ForbiddenException('this user is already a member of this workspace');
    }

    const membership = this.membershipRepository.create({
      role: WorkspaceRole.MEMBER,
      user,
      workspace: { id: workspaceId } as any,
    });
    return this.membershipRepository.save(membership);
  }

  async getMembers(workspaceId: string) {
    const memberships = await this.membershipRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['user'],
    });
    return memberships.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
    }));
  }

  async updateMemberRole(workspaceId: string, userId: string, role: WorkspaceRole) {
    const membership = await this.findMembershipOrFail(workspaceId, userId);

    if (membership.role === WorkspaceRole.OWNER) {
      throw new BadRequestException("The owner's role cannot be changed");
    }
    if (role === WorkspaceRole.OWNER) {
      throw new BadRequestException('Ownership transfer is not supported');
    }

    membership.role = role;
    await this.membershipRepository.save(membership);
    return { message: 'Role updated successfully' };
  }

  async removeMember(workspaceId: string, userId: string) {
    const membership = await this.findMembershipOrFail(workspaceId, userId);

    if (membership.role === WorkspaceRole.OWNER) {
      throw new BadRequestException('The owner cannot be removed');
    }

    await this.membershipRepository.remove(membership);
    return { message: 'Member removed successfully' };
  }

  private async findMembershipOrFail(workspaceId: string, userId: string) {
    const membership = await this.membershipRepository.findOne({
      where: { workspace: { id: workspaceId }, user: { id: userId } },
    });
    if (!membership) throw new NotFoundException('Member not found in this workspace');
    return membership;
  }
}