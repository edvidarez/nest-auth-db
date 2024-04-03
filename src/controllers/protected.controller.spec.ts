import { Test, TestingModule } from '@nestjs/testing';
import { ProtectedController } from './protected.controller';
import { UsersService } from '../services/users.service';

describe('ProtectedController', () => {
  let protectedController: ProtectedController;
  const mockUsersService = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const Protected: TestingModule = await Test.createTestingModule({
      controllers: [ProtectedController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    protectedController =
      Protected.get<ProtectedController>(ProtectedController);
  });

  it('should return success message', () => {
    expect(protectedController.getProtected()).toBe(
      'Successfully reached protected route!',
    );
  });

  it('should return all users', async () => {
    const users = [
      {
        username: 'test',
        password: 'test',
      },
    ];
    mockUsersService.findAll = jest.fn().mockResolvedValue(users);
    expect(await protectedController.getUsers()).toBe(users);
  });

  it('should delete a user', async () => {
    const req = {
      user: {
        id: 1,
      },
    };
    mockUsersService.findByUsername = jest.fn().mockResolvedValue({
      username: 'test',
      password: 'test',
    });
    mockUsersService.remove = jest.fn().mockResolvedValue({
      message: 'User deleted successfully',
    });
    expect(await protectedController.deleteUser(req)).toEqual({
      message: 'User deleted successfully',
    });
  });

  it('should throw an error if user not found', async () => {
    const req = {
      user: {
        id: 1,
      },
    };
    mockUsersService.remove = jest
      .fn()
      .mockRejectedValueOnce(new Error('User not found'));

    expect(protectedController.deleteUser(req)).rejects.toThrow(
      'User not found',
    );
  });
});
