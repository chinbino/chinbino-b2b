// src/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // ترکیب دو Guard
export class AdminController {
  
  @Get('dashboard')
  @Roles('admin')
  getDashboard() {
    return {
      message: 'Admin Dashboard',
      data: 'اطلاعات حساس ادمین',
      timestamp: new Date().toISOString()
    };
  }

  @Get('users')
  @Roles('admin')
  getAllUsers() {
    return {
      message: 'لیست تمام کاربران',
      users: [
        // لیست کاربران
      ]
    };
  }

  @Get('stats')
  @Roles('admin', 'seller') // چند نقش
  getStats() {
    return {
      message: 'آمار سیستم',
      stats: {
        totalUsers: 50,
        activeUsers: 42,
        totalOrders: 120
      }
    };
  }
}
