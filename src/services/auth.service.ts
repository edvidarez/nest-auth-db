import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: User) {
    const existingUser = await this.userService.findByUsername(user.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    return this.userService.create(user);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      delete user.password;
      const payload = { ...user, sub: user.id };
      return {
        ...user,
        access_token: this.jwtService.sign(payload),
      };
    }
    return null;
  }
}
