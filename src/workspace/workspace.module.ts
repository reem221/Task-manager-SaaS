import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Workspace } from './workspace.entity';
import { Membership } from 'src/entity/membership.entity';
import { User } from 'src/entity/user.entity';
import { KanbanColumn } from 'src/column/column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, Membership, User, KanbanColumn])],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
  exports: [TypeOrmModule], 
})
export class WorkspaceModule {}