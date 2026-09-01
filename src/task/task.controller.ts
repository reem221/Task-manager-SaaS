import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WorkspaceRolesGuard } from '../workspace/guards/workspace-roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/wt-auth.guard';

@Controller('workspaces/:workspaceId/tasks')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard) 
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(workspaceId, createTaskDto);
  }

  @Get()
  async findAll(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return this.taskService.findAllByWorkspace(workspaceId);
  }

  @Patch(':taskId')
  async update(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(taskId, workspaceId, updateTaskDto);
  }

  @Delete(':taskId')
  async remove(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.remove(taskId, workspaceId);
  }
}