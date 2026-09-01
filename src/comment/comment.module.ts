import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    WorkspaceModule, 
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
