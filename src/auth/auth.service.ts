import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { AdminRegisterDto, RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { SystemRole } from 'src/common/enums/roles.enum';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private readonly userService: UserService
  ) {}

  private sanitize(user: User) {
  const { password, passwordResetCode, passwordResetExpires, passwordResetVerified, ...safe } = user;
  return safe;
  }

private async createAccount(registerDto: RegisterDto, systemRole: SystemRole) {
  const existing = await this.userService.findByEmail(registerDto.email);
  if (existing) {
    throw new ConflictException('Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(registerDto.password, 12);

  const newUser = await this.userService.createUser({
    name: registerDto.name,
    email: registerDto.email,
    country: registerDto.country,
    systemRole,
    password: hashedPassword,
  });

  return this.sanitize(newUser);
}

async signup(registerDto: RegisterDto) {
  const user = await this.createAccount(registerDto, SystemRole.USER);
  return { message: 'Account created successfully', user };
}

async register(registerDto: AdminRegisterDto) {
  const user = await this.createAccount(
    registerDto,
    registerDto.systemRole ?? SystemRole.USER,
  );
  return { message: 'User registered successfully', user };
}

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);
    const valid = !!user?.password && (await bcrypt.compare(password, user.password));
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, systemRole: user.systemRole};
    return {
      access_token: this.jwtService.sign(payload),
      user: this.sanitize(user),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) return; 

    const token = randomBytes(32).toString('hex');
    user.passwordResetCode = createHash('sha256').update(token).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepository.save(user);

    await this.emailService.sendResetPasswordLink(email, token); 
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const hash = createHash('sha256').update(token).digest('hex');
    const user = await this.userRepository.findOne({ where: { passwordResetCode: hash } });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);
  }
}
