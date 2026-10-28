import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { KanbanColumn } from '../column/column.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
  ) {}

  async create(workspaceId: number, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      workspace: { id: workspaceId } as any,
    });
    const savedProject = await this.projectRepository.save(project);

    const defaultColumns = ['To Do', 'In Progress', 'Done'];
    const columns = defaultColumns.map((title, index) =>
      this.columnRepository.create({
        title,
        position: index,
        project: savedProject,
      }),
    );
    await this.columnRepository.save(columns);

    return savedProject;
  }

  async findAllByWorkspace(workspaceId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(projectId: number, workspaceId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, workspace: { id: workspaceId } },
      relations: ['columns', 'tasks'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(projectId: number, workspaceId: string, updateDto: Partial<CreateProjectDto>): Promise<Project> {
    const project = await this.findOne(projectId, workspaceId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    Object.assign(project, updateDto);
    return this.projectRepository.save(project);
  }

  async remove(projectId: number, workspaceId: string): Promise<{ message: string }> {
    const project = await this.findOne(projectId, workspaceId);
    await this.projectRepository.remove(project);
    return { message: 'Project deleted successfully along with all related data' };
  }
}