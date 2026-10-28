import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Roles } from '../workspace/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from 'src/common/guards/workspace-roles.guard';
import { WorkspaceRole } from 'src/common/enums/roles.enum';

@Controller('workspaces/:workspaceId/projects')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(WorkspaceRole.ADMIN)
  async create(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(workspaceId, createProjectDto);
  }

  @Get()
  async findAll(@Param('workspaceId', ParseUUIDPipe) workspaceId: string) {
    return this.projectService.findAllByWorkspace(workspaceId);
  }

  @Get(':projectId')
  async findOne(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.findOne(projectId, workspaceId);
  }

  @Patch(':projectId')
  @Roles(WorkspaceRole.ADMIN, WorkspaceRole.OWNER)
  async update(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateDto: CreateProjectDto,
  ) {
    return this.projectService.update(projectId, workspaceId, updateDto);
  }

  @Delete(':projectId')
  @Roles(WorkspaceRole.ADMIN)
  async remove(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.remove(projectId, workspaceId);
  }
}