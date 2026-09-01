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
        workspace: { id: workspaceId } as any,
        project: savedProject,
      }),
    );
    await this.columnRepository.save(columns);

    return savedProject;
  }

  async findAllByWorkspace(workspaceId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(projectId: number, workspaceId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, workspace: { id: workspaceId } },
      relations: ['columns', 'tasks'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async remove(projectId: number, workspaceId: number): Promise<{ message: string }> {
    const project = await this.findOne(projectId, workspaceId);
    await this.projectRepository.remove(project);
    return { message: 'Project deleted successfully along with all related data' };
  }
}