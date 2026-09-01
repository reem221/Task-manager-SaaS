import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
//import { User } from '../user/user.entity';
import { Workspace } from './workspace.entity';

export enum WorkspaceRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity('memberships')
@Unique(['user', 'workspace']) 
export class Membership {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: WorkspaceRole,
    default: WorkspaceRole.MEMBER,
  })
  role!: WorkspaceRole;

  //@ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  //user!: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.members, { onDelete: 'CASCADE' })
  workspace!: Workspace;
}