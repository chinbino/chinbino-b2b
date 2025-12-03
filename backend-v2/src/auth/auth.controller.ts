import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request, 
  UsePipes, 
  ValidationPipe,
  UnauthorizedException  // ✅ این خط اضافه شد
} from '@nestjs/common';
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
    // چندین روش برای گرفتن userId
    const userId = req.user?.id || req.user?.userId || req.user?.sub;
    
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    
    return this.authService.getProfile(userId);
  }

  @Get('test-protected')
  @UseGuards(JwtAuthGuard)
  async testProtected(@Request() req) {
    return {
      message: 'شما با موفقیت وارد شده‌اید',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  // 🔍 اضافه شده: endpoint دیباگ
  @Get('debug-user')
  @UseGuards(JwtAuthGuard)
  debugUser(@Request() req) {
    return {
      message: 'Debug JWT Authentication',
      success: true,
      userObject: req.user,
      availableKeys: Object.keys(req.user || {}),
      checks: {
        hasId: !!req.user?.id,
        hasUserId: !!req.user?.userId,
        hasSub: !!req.user?.sub,
        idValue: req.user?.id,
        userIdValue: req.user?.userId,
        subValue: req.user?.sub
      },
      timestamp: new Date().toISOString()
    };
  }
}
