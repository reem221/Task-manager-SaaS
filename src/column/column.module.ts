import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { KanbanColumn } from './column.entity';
import { WorkspaceModule } from '../workspace/workspace.module'; 
import { Project } from 'src/project/project.entity';
import { Membership } from 'src/workspace/membership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KanbanColumn, Project, Membership]),
    WorkspaceModule,
  ],
  providers: [ColumnService],
  controllers: [ColumnController],
})
export class ColumnModule {}