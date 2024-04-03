import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: User) {
    const newuser = this.userRepository.create(user);
    return this.userRepository.save(newuser);
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }

  async findAll() {
    return this.userRepository.find();
  }
}
