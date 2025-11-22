import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: {
    email?: string;
    phone?: string;
    password: string;
    fullName?: string;
    companyName?: string;
    role?: 'buyer' | 'seller' | 'admin';
  }): Promise<User> {
    
    // بررسی تکراری نبودن ایمیل
    if (userData.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email }
      });
      if (existingUser) {
        throw new ConflictException('این ایمیل قبلاً ثبت شده است');
      }
    }

    // بررسی تکراری نبودن شماره تلفن
    if (userData.phone) {
      const existingUser = await this.usersRepository.findOne({
        where: { phone: userData.phone }
      });
      if (existingUser) {
        throw new ConflictException('این شماره تلفن قبلاً ثبت شده است');
      }
    }

    // هش کردن رمز عبور
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const user = this.usersRepository.create({
      ...userData,
      passwordHash,
      role: userData.role || 'buyer',
      status: 'active',
    });

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'status']
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'phone', 'role', 'fullName', 'companyName', 'preferredLanguage', 'preferredCurrency']
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    
    return null;
  }
}
