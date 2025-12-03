import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chinbino-super-secret-key-2024-v2',
    });
  }

  async validate(payload: any) {
    // payload.sub باید userId باشه
    const userId = payload.sub;
    
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User account is not active');
    }
    
    // این ساختار مهمه: باید id داشته باشه
    return {
      id: user.id,           // مهمترین فیلد
      userId: user.id,       // جایگزین
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      status: user.status
    };
  }
}
