import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
    const user = await this.usersService.findById(payload.sub);
    
    if (!user || user.status !== 'active') {
      return null;
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
