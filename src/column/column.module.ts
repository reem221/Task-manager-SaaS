import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { KanbanColumn } from './column.entity';
import { WorkspaceModule } from '../workspace/workspace.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([KanbanColumn]),
    WorkspaceModule,
  ],
  providers: [ColumnService],
  controllers: [ColumnController],
})
export class ColumnModule {}