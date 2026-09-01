import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Workspace } from '../workspace/workspace.entity';
import { KanbanColumn } from '../column/column.entity';
import { Task } from '../task/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; 

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace!: Workspace;

  @OneToMany(() => KanbanColumn, (column) => column.project)
  columns!: KanbanColumn[];

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}