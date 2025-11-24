import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    console.log('JWT Validation - Payload:', payload); // برای دیباگ
    
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      console.log('User not found for ID:', payload.sub);
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'active') {
      console.log('User not active:', user.id, user.status);
      throw new UnauthorizedException('User account is not active');
    }

    console.log('JWT Validation - User found:', user.id, user.email);
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
