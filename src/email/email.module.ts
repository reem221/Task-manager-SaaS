import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; 
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    ConfigModule, 
    JwtModule.register({
      secret: 'SUPER_SECRET_RESET_KEY_2026',
      signOptions: { expiresIn: '900s' }, 
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], 
})
export class EmailModule {}