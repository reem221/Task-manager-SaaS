import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
//import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  //@ManyToOne(() => User, { onDelete: 'CASCADE' })
  //author: User;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  task!: Task;
}