import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // استفاده از DTO برای validation
    const { email, password, fullName, phone, companyName, role } = registerDto;

    // ایجاد کاربر جدید
    const user = await this.usersService.create({
      email,
      phone,
      password, // مطمئن شو این خط درست باشه
      fullName,
      companyName,
      role,
    });

    // ایجاد توکن
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 24 * 60 * 60, // 24 ساعت به ثانیه
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName,
        companyName: user.companyName,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        status: user.status,
        createdAt: user.createdAt,
      },
    };
  }

  async login(email: string, password: string) {
    // بررسی اعتبار کاربر
    const user = await this.usersService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز عبور نادرست است');
    }

    // بررسی وضعیت کاربر
    if (user.status !== 'active') {
      throw new UnauthorizedException('حساب کاربری غیرفعال است');
    }

    // بررسی isActive
    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری غیرفعال است');
    }

    // ایجاد توکن
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 24 * 60 * 60, // 24 ساعت به ثانیه
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        companyName: user.companyName,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        status: user.status,
        createdAt: user.createdAt,
      },
    };
  }

  async getProfile(userId: string) {
    return await this.usersService.findById(userId);
  }

  // متد جدید برای validateUser (مورد استفاده در LocalStrategy)
  async validateUser(email: string, password: string): Promise<any> {
    return await this.usersService.validateUser(email, password);
  }
}
