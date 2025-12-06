// src/suppliers/suppliers.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // ثبت‌نام Supplier (فقط کاربران authenticated)
  @Post('register')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body() createSupplierDto: CreateSupplierDto,
    @Request() req
  ) {
    // اضافه کردن userId از token
    createSupplierDto.userId = req.user.id;
    
    return {
      success: true,
      message: 'Supplier registration successful',
      data: await this.suppliersService.create(createSupplierDto)
    };
  }

  // لیست Supplierهای تاییدشده (public)
  @Get()
  async findAll(@Query('all') all: string) {
    // اگر all=true باشد، verifiedOnly=false (همه را بیاور)
    // اگر all نباشد یا false باشد، verifiedOnly=true (فقط verifiedها)
    const verifiedOnly = !(all === 'true');
    
    return {
      success: true,
      data: await this.suppliersService.findAll(verifiedOnly)
    };
  }

  // جزئیات یک Supplier (public)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.suppliersService.findOne(id)
    };
  }

  // پروفایل Supplier (برای خود Supplier)
  @Get('profile/my')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    return {
      success: true,
      data: await this.suppliersService.findByUserId(req.user.id)
    };
  }

  // به‌روزرسانی پروفایل Supplier
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Request() req
  ) {
    const supplier = await this.suppliersService.findByUserId(req.user.id);
    
    return {
      success: true,
      message: 'Profile updated successfully',
      data: await this.suppliersService.update(supplier.id, updateSupplierDto)
    };
  }

  // مدیریت Supplierها (فقط ادمین)
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return {
      success: true,
      message: 'Status updated successfully',
      data: await this.suppliersService.update(id, { 
        verificationStatus: status 
      })
    };
  }

  // حذف Supplier (فقط ادمین)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.suppliersService.remove(id);
    return {
      success: true,
      message: 'Supplier deleted successfully'
    };
  }

  // آمار Supplierها (برای ادمین)
  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStats() {
    // برای آمار همه supplierها را می‌خواهیم (حتی غیرفعال‌ها)
    const suppliers = await this.suppliersService.findAll(false);
    
    const stats = {
      total: suppliers.length,
      byStatus: {
        pending: suppliers.filter(s => s.verificationStatus === 'pending').length,
        verified: suppliers.filter(s => s.verificationStatus === 'verified').length,
        rejected: suppliers.filter(s => s.verificationStatus === 'rejected').length,
        suspended: suppliers.filter(s => s.verificationStatus === 'suspended').length
      },
      byCountry: {
        iran: suppliers.filter(s => s.country === 'iran').length,
        china: suppliers.filter(s => s.country === 'china').length
      },
      active: suppliers.filter(s => s.isActive).length
    };

    return {
      success: true,
      data: stats
    };
  }
}
