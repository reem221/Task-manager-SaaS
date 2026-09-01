import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { KanbanColumn } from 'src/column/column.entity';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, KanbanColumn]),
    WorkspaceModule, 
  ],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule {}
