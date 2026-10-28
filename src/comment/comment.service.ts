import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(taskId: number, userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      task: { id: taskId } as any,
      author: { id: userId } as any,
    });

    const savedComment = await this.commentRepository.save(comment);
    
    return this.commentRepository.findOneOrFail({
      where: { id: savedComment.id },
      relations: ['author'],
    });
  }

  async findAllByTask(taskId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['author'], 
      order: { createdAt: 'ASC' }, 
    });
  }

  async remove(commentId: number, userId: number): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('the comment does not exist');
    }

    if (comment.author.id !== String(userId)) {
      throw new ForbiddenException('you are not the owner of this comment');
    }

    await this.commentRepository.remove(comment);
    return { message: 'the comment has been deleted successfully' };
  }
}