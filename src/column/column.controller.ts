import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseUUIDPipe, ParseIntPipe, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from 'src/common/guards/workspace-roles.guard';
import { ColumnService } from './column.service';
import { Roles } from 'src/workspace/decorators/roles.decorator';
import { WorkspaceRole } from 'src/common/enums/roles.enum';
import { UpdateColumnDto } from './dto/update-column.dto';
import { CreateColumnDto } from './dto/create-column.dto';

@Controller('workspaces/:workspaceId/projects/:projectId/columns')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get()
  async getColumns(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.columnService.findAllByProject(projectId, workspaceId);
  }

  @Post()
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async createColumn(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateColumnDto,
  ) {
    return this.columnService.create(projectId, workspaceId, dto);
  }

  @Patch(':columnId')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async updateColumn(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnService.update(columnId, workspaceId, projectId, dto);
  }

  @Delete(':columnId')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async deleteColumn(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
   return this.columnService.remove(columnId, workspaceId, projectId);
  }
}