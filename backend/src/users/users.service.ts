import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  async createSeller(sellerData: {
    email: string;
    phone: string;
    password: string;
    companyNameZh: string;
    companyNameFa: string;
    marketLocation: string;
    boothNumbers: string;
  }): Promise<User> {
    
    // بررسی وجود کاربر با همین ایمیل
    const existingUser = await this.usersRepository.findOne({
      where: { email: sellerData.email }
    });

    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    // هش کردن رمز عبور
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(sellerData.password, saltRounds);

    const user = this.usersRepository.create({
      ...sellerData,
      passwordHash,
      role: 'seller',
      preferredLanguage: 'zh',
      preferredCurrency: 'CNY',
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
    });

    return await this.usersRepository.save(user);
  }

  async createCustomer(customerData: {
    email: string;
    phone: string;
    password: string;
  }): Promise<User> {
    
    const existingUser = await this.usersRepository.findOne({
      where: { email: customerData.email }
    });

    if (existingUser) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(customerData.password, saltRounds);

    const user = this.usersRepository.create({
      ...customerData,
      passwordHash,
      role: 'customer',
      preferredLanguage: 'fa',
      preferredCurrency: 'IRR',
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
    });

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    
    return null;
  }
}
