// src/column/column.entity.ts
import { Project } from 'src/project/project.entity';
import { Workspace } from 'src/workspace/workspace.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

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

  @ManyToOne(() => Workspace, (workspace) => workspace.id, { onDelete: 'CASCADE' })
  workspace!: Workspace;

  @ManyToOne(() => Project, (project) => project.columns, { onDelete: 'CASCADE', nullable: true })
  project!: Project;
}