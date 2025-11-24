import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
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
    
    if (!userData.password) {
      throw new BadRequestException('رمز عبور الزامی است');
    }

    if (userData.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email }
      });
      if (existingUser) {
        throw new ConflictException('این ایمیل قبلاً ثبت شده است');
      }
    }

    if (userData.phone) {
      const existingUser = await this.usersRepository.findOne({
        where: { phone: userData.phone }
      });
      if (existingUser) {
        throw new ConflictException('این شماره تلفن قبلاً ثبت شده است');
      }
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const user = this.usersRepository.create({
      email: userData.email,
      phone: userData.phone,
      passwordHash: passwordHash,
      fullName: userData.fullName,
      companyName: userData.companyName,
      role: userData.role || 'buyer',
      status: 'active',
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      preferredLanguage: 'fa',
      preferredCurrency: 'IRR'
    });

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { email: email }
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { id: id }
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { id: id }
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
