import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { KanbanColumn } from 'src/column/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
  ) {}

  private async getColumnOrFail(columnId: number, projectId: number, workspaceId: string) {
    const column = await this.columnRepository.findOne({
      where: {
        id: columnId,
        project: { id: projectId, workspace: { id: workspaceId } },
      },
    });
    if (!column) {
      throw new NotFoundException('Column does not exist in this project');
    }
    return column;
  }

  async create(workspaceId: string, projectId: number, dto: CreateTaskDto): Promise<Task> {
    const { title, description, columnId, assigneeId, dueDate } = dto;

    const column = await this.getColumnOrFail(columnId, projectId, workspaceId);

    const task = this.taskRepository.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      column,
      project: { id: projectId },
      assignee: assigneeId ? { id: assigneeId } : undefined,
    });

    return this.taskRepository.save(task);
  }

  async findAllByProject(workspaceId: string, projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { project: { id: projectId, workspace: { id: workspaceId } } },
      relations: ['column', 'assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    taskId: number,
    workspaceId: string,
    projectId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        project: { id: projectId, workspace: { id: workspaceId } },
      },
    });
    if (!task) {
      throw new NotFoundException('Task does not exist in this project');
    }

    if (dto.columnId) {
      task.column = await this.getColumnOrFail(dto.columnId, projectId, workspaceId);
    }
    if (dto.assigneeId !== undefined) {
      task.assignee = dto.assigneeId ? ({ id: dto.assigneeId } as any) : null;
    }
    if (dto.title) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.dueDate) task.dueDate = new Date(dto.dueDate);

    return this.taskRepository.save(task);
  }

  async remove(taskId: number, workspaceId: string, projectId: number): Promise<{ message: string }> {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        project: { id: projectId, workspace: { id: workspaceId } },
      },
    });
    if (!task) {
      throw new NotFoundException('Task does not exist in this project');
    }

    await this.taskRepository.remove(task);
    return { message: 'The task has been deleted successfully' };
  }
}