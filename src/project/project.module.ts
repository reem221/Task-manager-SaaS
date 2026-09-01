import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { KanbanColumn } from 'src/column/column.entity';
import { Project } from './project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, KanbanColumn]),
    WorkspaceModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [TypeOrmModule],
})
export class ProjectModule {}
