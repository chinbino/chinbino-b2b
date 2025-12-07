import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create({
      ...data,
      role: data.role ?? UserRole.BUYER,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }
}
