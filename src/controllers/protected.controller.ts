import { Controller, Delete, Get, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../models/user.entity';

@ApiTags('Protected routes')
@ApiBearerAuth()
@Controller('protected')
export class ProtectedController {
  constructor(private userService: UsersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Access a protected route' })
  @ApiResponse({
    status: 200,
    description: 'Successfully reached protected route!',
  })
  getProtected() {
    return 'Successfully reached protected route!';
  }

  @Get('/users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async getUsers() {
    return await this.userService.findAll();
  }

  @Delete('/user')
  @ApiOperation({ summary: 'Delete the current user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Req() req) {
    const user = req.user;
    await this.userService.remove(user.id);
    return {
      message: 'User deleted successfully',
    };
  }
}
