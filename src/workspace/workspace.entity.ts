import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Membership } from './membership.entity';
import { Project } from 'src/project/project.entity';
import { User } from 'src/user/user.entity';

@Entity('workspace')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @OneToMany(() => Membership, (membership) => membership.workspace)
  members!: Membership[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner!: User;

  @OneToMany(() => Project, (project) => project.workspace)
  projects!: Project[];
}