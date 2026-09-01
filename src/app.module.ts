import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Project } from './entity/project.entity';
import { Workspace } from './workspace/workspace.entity';
import { User } from './entity/user.entity';
import { WorkspaceService } from './workspace/workspace.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { ColumnModule } from './column/column.module';
import { Membership } from './entity/membership.entity';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
      }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432,
      username: 'reem_dev',
      password: 'password123',
      database: 'task_manager_db',
      entities: [User, Workspace, Membership, Project, Task], 
      synchronize: true, 
    }),
    AuthModule, EmailModule, WorkspaceModule, ColumnModule, TaskModule, ProjectModule, CommentModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService, WorkspaceService],
})
export class AppModule {}
