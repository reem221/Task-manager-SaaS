import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KanbanColumn } from './column.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(KanbanColumn)
    private readonly columnRepository: Repository<KanbanColumn>,
  ) {}

  async findAllByWorkspace(workspaceId: number): Promise<KanbanColumn[]> {
    return this.columnRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { position: 'ASC' },
    });
  }

  async create(workspaceId: number, title: string): Promise<KanbanColumn> {
    const count = await this.columnRepository.count({ where: { workspace: { id: workspaceId } } });
    
    const newColumn = this.columnRepository.create({
      title,
      position: count,
      workspace: { id: workspaceId } as any,
    });
    return this.columnRepository.save(newColumn);
  }

  async remove(columnId: number): Promise<{ message: string }> {
    const column = await this.columnRepository.findOne({ where: { id: columnId } });
    if (!column) throw new NotFoundException('the column not found');
    await this.columnRepository.remove(column);
    return { message: 'the column has been removed successfully' };
  }
}