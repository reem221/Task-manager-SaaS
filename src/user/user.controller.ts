import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/wt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/me
  @Get('me')
  async getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.userId);
  }

  // PATCH /users/me
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  // PATCH /users/me/change-password
  @Patch('me/change-password')
  async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, changePasswordDto);
  }
}