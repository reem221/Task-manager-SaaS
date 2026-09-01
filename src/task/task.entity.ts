import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Workspace } from '../workspace/workspace.entity';
import { KanbanColumn } from '../column/column.entity';
//import { User } from 'src/entity/user.entity';
import { Project } from 'src/project/project.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  dueDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace!: Workspace;

  @ManyToOne(() => KanbanColumn, { onDelete: 'CASCADE' })
  column!: KanbanColumn;

  //@ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  //assignee!: User;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE', nullable: true })
  project!: Project;
}