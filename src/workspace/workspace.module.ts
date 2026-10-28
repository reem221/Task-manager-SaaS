import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Workspace } from './workspace.entity';
import { KanbanColumn } from 'src/column/column.entity';
import { Membership } from './membership.entity';
import { User } from 'src/user/user.entity';
import { Project } from 'src/project/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, Membership, User, KanbanColumn, Project])],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
  exports: [TypeOrmModule], 
})
export class WorkspaceModule {}