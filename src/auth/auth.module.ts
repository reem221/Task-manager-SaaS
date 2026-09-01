import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    JwtModule.register({
      secret: 'SECRET_KEY_REEM_2026', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  providers: [AuthService, EmailService],
  controllers: [AuthController],
})
export class AuthModule {}