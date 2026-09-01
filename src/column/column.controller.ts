import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ColumnService } from './column.service';
import { WorkspaceRolesGuard } from '../workspace/guards/workspace-roles.guard';
import { Roles } from '../workspace/decorators/roles.decorator';
import { WorkspaceRole } from 'src/entity/membership.entity';
import { JwtAuthGuard } from 'src/auth/guards/wt-auth.guard';

@Controller('workspaces/:workspaceId/columns')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard) 
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get()
  async getColumns(@Param('workspaceId') workspaceId: number) {
    return this.columnService.findAllByWorkspace(workspaceId);
  }

  @Post()
  @Roles(WorkspaceRole.ADMIN)
  async createColumn(@Param('workspaceId') workspaceId: number, @Body('title') title: string) {
    return this.columnService.create(workspaceId, title);
  }

  @Delete(':columnId')
  @Roles(WorkspaceRole.ADMIN)
  async deleteColumn(@Param('columnId') columnId: number) {
    return this.columnService.remove(columnId);
  }
}