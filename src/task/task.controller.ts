import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from 'src/common/guards/workspace-roles.guard';

@Controller('workspaces/:workspaceId/projects/:projectId/tasks')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard) 
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(workspaceId, projectId, createTaskDto);
  }

  @Get()
  async findAll(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.taskService.findAllByProject(workspaceId, projectId);
  }

  @Patch(':taskId')
  async update(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(taskId, workspaceId, projectId, updateTaskDto);
  }

  @Delete(':taskId')
  async remove(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.remove(taskId, workspaceId, projectId);
  }
}