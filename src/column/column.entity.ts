// src/column/column.entity.ts
import { Project } from 'src/project/project.entity';
import { Task } from 'src/task/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('columns')
export class KanbanColumn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string; 

  @Column({ default: 0 })
  position!: number; 
  
  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Project, (project) => project.columns, { onDelete: 'CASCADE', nullable: true })
  project!: Project;

  @OneToMany(() => Task, (task) => task.column)
  tasks!: Task[];
}