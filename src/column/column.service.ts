import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KanbanColumn } from './column.entity';
import { Project } from 'src/project/project.entity';
import { UpdateColumnDto } from './dto/update-column.dto';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAllByProject(projectId: number, workspaceId: string): Promise<KanbanColumn[]> {
    return this.columnRepository.find({
      where: {
        project: {
          id: projectId,
          workspace: { id: workspaceId },
        },
      },
      order: { position: 'ASC' },
    });
  }

  async create(projectId: number, workspaceId: string, dto: CreateColumnDto): Promise<KanbanColumn> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, workspace: { id: workspaceId } },
    });
    if (!project) throw new NotFoundException('Project not found');

    const last = await this.columnRepository.findOne({
      where: { project: { id: projectId } },
      order: { position: 'DESC' },
    });
    const position = last ? last.position + 1 : 0;

    const newColumn = this.columnRepository.create({
      ...dto,
      position: position,
      project,
    });
    return this.columnRepository.save(newColumn);
  }

  async update(columnId: number, workspaceId: string, projectId: number, dto: UpdateColumnDto) {
    const column = await this.columnRepository.findOne({
      where: { id: columnId, project: { id: projectId, workspace: { id: workspaceId } } },
    });
    if (!column) throw new NotFoundException('Column not found');
    Object.assign(column, dto);
    return this.columnRepository.save(column);
  }

  async remove(columnId: number, workspaceId: string, projectId: number): Promise<{ message: string }> {
    const column = await this.columnRepository.findOne({
      where: { id: columnId, project: { id: projectId, workspace: { id: workspaceId } } },
      relations: ['tasks'],
    });
    if (!column) throw new NotFoundException('Column not found');

    if (column.tasks?.length) {
      throw new BadRequestException('Move or delete the tasks in this column first');
    }

    await this.columnRepository.remove(column);
    return { message: 'Column deleted successfully' };
  }
}