import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { User } from '../../src/models/user.entity';
import { AuthService } from '../../src/services/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockAuthService.register.mockClear();
    mockAuthService.login.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const user: User = { id: 1, username: 'testUser', password: 'password' };
    mockAuthService.register.mockResolvedValue(user);

    expect(await controller.register(user)).toEqual(user);
    expect(mockAuthService.register).toHaveBeenCalledWith(user);
  });

  it('should throw ConflictException if username already exists', async () => {
    const user: User = {
      id: 1,
      username: 'existingUser',
      password: 'password',
    };
    mockAuthService.register.mockRejectedValue(
      new Error('Username already exists'),
    );

    await expect(controller.register(user)).rejects.toThrow(
      'Username already exists',
    );
    expect(mockAuthService.register).toHaveBeenCalledWith(user);
  });

  it('should throw BadRequestException if an unexpected error occurs', async () => {
    const user: User = { id: 1, username: 'testUser', password: 'password' };
    mockAuthService.register.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.register(user)).rejects.toThrow('Unexpected error');
    expect(mockAuthService.register).toHaveBeenCalledWith(user);
  });

  it('should login successfully with correct credentials', async () => {
    const user: User = { id: 1, username: 'testUser', password: 'password' };
    mockAuthService.login.mockResolvedValue({ ...user, token: 'jwtToken' });

    const result = await controller.login(user);
    expect(result).toEqual({ ...user, token: 'jwtToken' });
    expect(mockAuthService.login).toHaveBeenCalledWith(
      user.username,
      user.password,
    );
  });

  it('should throw UnauthorizedException if user not found', async () => {
    const user: User = { id: 1, username: 'unknownUser', password: 'password' };
    mockAuthService.login.mockResolvedValue(null);

    await expect(controller.login(user)).rejects.toThrow(UnauthorizedException);

    expect(mockAuthService.login).toHaveBeenCalledWith(
      user.username,
      user.password,
    );
  });
});
