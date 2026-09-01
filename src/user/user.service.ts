import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
    delete user.password; 
    return user;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.getProfile(userId);
    Object.assign(user, updateProfileDto);
    return this.userRepository.save(user);
  }

  
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.password) {
      throw new NotFoundException('user not found or password not set');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

  
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }
}