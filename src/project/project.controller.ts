import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { WorkspaceRolesGuard } from '../workspace/guards/workspace-roles.guard';
import { Roles } from '../workspace/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/wt-auth.guard';
import { WorkspaceRole } from '../workspace/membership.entity'; 

@Controller('workspaces/:workspaceId/projects')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(WorkspaceRole.ADMIN)
  async create(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(workspaceId, createProjectDto);
  }

  @Get()
  async findAll(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return this.projectService.findAllByWorkspace(workspaceId);
  }

  @Get(':projectId')
  async findOne(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.findOne(projectId, workspaceId);
  }

  @Delete(':projectId')
  @Roles(WorkspaceRole.ADMIN)
  async remove(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.remove(projectId, workspaceId);
  }
}