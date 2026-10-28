import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from 'src/common/guards/workspace-roles.guard';

@Controller('workspaces/:workspaceId/tasks/:taskId/comments')
@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(taskId, req.user.userId, createCommentDto);
  }

  @Get()
  async findAll(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.commentService.findAllByTask(taskId);
  }

  @Delete(':commentId')
  async remove(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: any,
  ) {
    return this.commentService.remove(commentId, req.user.userId);
  }
}