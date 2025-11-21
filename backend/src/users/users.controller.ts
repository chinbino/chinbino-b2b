import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      preferredLanguage: req.user.preferredLanguage,
      preferredCurrency: req.user.preferredCurrency,
    };
  }

  @Get('sellers')
  @Roles('admin')
  async getAllSellers() {
    // اینو بعداً تکمیل می‌کنیم
    return { message: 'لیست فروشندگان' };
  }

  @Get(':id')
  @Roles('admin')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
