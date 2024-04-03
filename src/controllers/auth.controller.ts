import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: User,
  })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: User, description: 'User Registration Data' })
  async register(@Body() user: User) {
    try {
      const newUser = await this.authService.register(user);
      return newUser;
    } catch (error) {
      if (error.message === 'Username already exists') {
        throw new ConflictException('Username already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: User, description: 'User Login Data' })
  async login(@Body() { username, password }: User) {
    const user = await this.authService.login(username, password);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
