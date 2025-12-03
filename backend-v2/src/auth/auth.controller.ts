import { Controller, Post, Body, Get, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    // تغییر از req.user.sub به req.user.id چون در JWT Strategy برگردوندیم
    return this.authService.getProfile(req.user.id);
  }

  // اضافه کردن endpoint برای تست JWT
  @Get('test-protected')
  @UseGuards(JwtAuthGuard)
  async testProtected(@Request() req) {
    return {
      message: 'شما با موفقیت وارد شده‌اید',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
