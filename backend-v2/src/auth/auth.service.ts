import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerData: {
    email?: string;
    phone?: string;
    password: string;
    fullName?: string;
    companyName?: string;
    role?: 'buyer' | 'seller';
  }) {
    // بررسی وجود رمز عبور
    console.log('Register Data received:', registerData); // برای دیباگ
    
    if (!registerData.password) {
      throw new BadRequestException('رمز عبور الزامی است');
    }

    // ایجاد کاربر جدید
    const user = await this.usersService.create({
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password, // مطمئن شو این خط درست باشه
      fullName: registerData.fullName,
      companyName: registerData.companyName,
      role: registerData.role,
    });

    // ایجاد توکن
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName,
        companyName: user.companyName,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
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

    // ایجاد توکن
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        companyName: user.companyName,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
      },
    };
  }

  async getProfile(userId: string) {
    return await this.usersService.findById(userId);
  }
}
