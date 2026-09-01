import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm/browser/repository/Repository.js";
import { KanbanColumn } from "src/column/column.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
  ) {}

  async create(workspaceId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, columnId, assigneeId, dueDate } = createTaskDto;

    const column = await this.columnRepository.findOne({
      where: { id: columnId, workspace: { id: workspaceId } },
    });

    if (!column) {
      throw new NotFoundException('the specified column does not exist in this workspace');
    }

    const task = this.taskRepository.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      workspace: { id: workspaceId } as any,
      column: { id: columnId } as any,
      assignee: assigneeId ? ({ id: assigneeId } as any) : null,
    });

    return this.taskRepository.save(task);
  }

  async findAllByWorkspace(workspaceId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['column', 'assignee'], 
      order: { createdAt: 'DESC' },
    });
  }

  async update(taskId: number, workspaceId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, workspace: { id: workspaceId } },
    });

    if (!task) {
      throw new NotFoundException('the specified task does not exist in this workspace');
    }

    if (updateTaskDto.columnId) {
      task.column = { id: updateTaskDto.columnId } as any;
    }

    if (updateTaskDto.assigneeId !== undefined) {
      task.assignee = updateTaskDto.assigneeId ? ({ id: updateTaskDto.assigneeId } as any) : null;
    }

    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) task.description = updateTaskDto.description;
    if (updateTaskDto.dueDate) task.dueDate = new Date(updateTaskDto.dueDate);

    return this.taskRepository.save(task);
  }

  async remove(taskId: number, workspaceId: number): Promise<{ message: string }> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, workspace: { id: workspaceId } },
    });

    if (!task) {
      throw new NotFoundException('the specified task does not exist in this workspace');
    }

    await this.taskRepository.remove(task);
    return { message: 'the task has been deleted successfully' };
  }
}