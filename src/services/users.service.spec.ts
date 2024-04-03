import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserRepository.create.mockClear();
    mockUserRepository.save.mockClear();
    mockUserRepository.findOne.mockClear();
  });

  it('should create a new user and return that', async () => {
    const user: User = { id: 1, username: 'newUser', password: 'password' };
    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    expect(await service.create(user)).toEqual(user);
    expect(mockUserRepository.create).toHaveBeenCalledWith(user);
    expect(mockUserRepository.save).toHaveBeenCalledWith(user);
  });

  it('should find a user by username', async () => {
    const user: User = {
      id: 1,
      username: 'newUser',
      password: 'password',
    };
    mockUserRepository.findOne.mockResolvedValue(user);

    expect(await service.findByUsername('newUser')).toEqual(user);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'newUser' },
    });
  });

  it('should remove a user by id', async () => {
    mockUserRepository.delete = jest.fn();

    await service.remove('1');
    expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should find all users', async () => {
    const users: User[] = [
      { id: 1, username: 'newUser', password: 'password' },
      { id: 2, username: 'newUser2', password: 'password2' },
    ];
    mockUserRepository.find.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });
});
