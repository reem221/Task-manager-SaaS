import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { EmailService } from 'src/email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(authDto: RegisterDto) {
    const { email, name, password, country } = authDto;

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('This email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      country,
    });
    
    await this.userRepository.save(user);
    
    return { message: 'registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email is incorrect');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.emailService.sendResetPasswordLink(email);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const email = await this.emailService.decodeConfirmationToken(token);

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundException(`No user found for email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.passwordResetCode = null; 
    user.passwordResetExpires = null;
    user.passwordResetVerified = true;

    await this.userRepository.save(user);
  }
}