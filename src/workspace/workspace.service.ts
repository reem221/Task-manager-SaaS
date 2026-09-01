import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Membership, WorkspaceRole } from 'src/entity/membership.entity';
import { User } from 'src/entity/user.entity';
import { KanbanColumn } from 'src/column/column.entity';

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
    role: WorkspaceRole.ADMIN,
    user: { id: userId } as any,
    workspace: savedWorkspace,
  });
  await this.membershipRepository.save(membership);

  const defaultColumns = ['To Do', 'In Progress', 'Done'];
  const columnEntities = defaultColumns.map((title, index) => {
    return this.columnRepository.create({
      title,
      position: index, 
      workspace: savedWorkspace,
    });
  });
  await this.columnRepository.save(columnEntities);

  return savedWorkspace;
}

  async findAllForUser(userId: number): Promise<Workspace[]> {
    const memberships = await this.membershipRepository.find({
      where: { user: { id: userId } },
      relations: ['workspace'], 
    });
    return memberships.map((m) => m.workspace);
  }

  async findOne(workspaceId: number): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['memberships', 'memberships.user', 'owner'],
    });
    if (!workspace) {
      throw new NotFoundException('this workspace does not exist');
    }
    return workspace;
  }

  async update(workspaceId: number, updateDto: Partial<CreateWorkspaceDto>): Promise<Workspace> {
    const workspace = await this.findOne(workspaceId);
    Object.assign(workspace, updateDto);
    return this.workspaceRepository.save(workspace);
  }

  async remove(workspaceId: number): Promise<{ message: string }> {
    const workspace = await this.findOne(workspaceId);
    await this.workspaceRepository.remove(workspace);
    return { message: 'this workspace has been deleted successfully' };
  }

  async addMember(workspaceId: number, email: string): Promise<Membership> {
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
}