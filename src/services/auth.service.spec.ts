import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    create: jest.fn(),
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUsersService.create.mockClear();
    mockUsersService.findByUsername.mockClear();
    mockJwtService.sign.mockClear();
  });

  it('should successfully register a new user', async () => {
    const user = { id: 1, username: 'newUser', password: 'password' };
    mockUsersService.create.mockResolvedValue(user);

    const result = await service.register(user);
    expect(result).toEqual(user);
    expect(mockUsersService.create).toHaveBeenCalledWith(user);
  });

  it('should throw an error if register a new user already exists', async () => {
    const user = { id: 1, username: 'newUser', password: 'password' };
    mockUsersService.findByUsername.mockResolvedValueOnce({
      username: 'existingUser',
    });

    await expect(service.register(user)).rejects.toThrow(
      'Username already exists',
    );
  });

  it('should return a valid JWT token for valid credentials', async () => {
    const user = { id: 1, username: 'user', password: 'pass' };
    mockUsersService.findByUsername.mockResolvedValueOnce(user);
    mockJwtService.sign.mockReturnValue('signedJwtToken');
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const result = await service.login('user', 'pass');
    expect(result).toEqual({
      id: 1,
      username: 'user',
      access_token: 'signedJwtToken',
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      id: 1,
      username: user.username,
      sub: user.id,
    });
  });

  it('should return null when the password does not match', async () => {
    const user = { id: 1, username: 'user', password: 'pass' };
    mockUsersService.findByUsername.mockResolvedValueOnce(user);
    mockJwtService.sign.mockReturnValue('signedJwtToken');
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));

    const result = await service.login('user', 'wrong_pass');

    expect(result).toBeNull();
    expect(mockJwtService.sign).not.toHaveBeenCalled();
  });

  it('should return null for invalid credentials', async () => {
    mockUsersService.findByUsername.mockResolvedValue(null);

    const result = await service.login('user', 'wrongpass');

    expect(result).toBeNull();
  });
});
