import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';

// Mock bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const bcrypt = require('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn(),
  };

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: '$2b$10$hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.THERAPIST,
    isActive: true,
    clinicId: 'clinic-123',
    clinic: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null,
  };

  const createUserDto = {
    email: 'newuser@example.com',
    username: 'newuser',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: UserRole.THERAPIST,
    clinicId: 'clinic-123',
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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
    // Reset bcrypt mocks
    (bcrypt.hash as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null); // username check

      const hashedPassword = '$2b$10$newhashpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const newUser = { ...createUserDto, id: 'new-user-123', passwordHash: hashedPassword };
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // email check passes
        .mockResolvedValueOnce(mockUser); // username check fails

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword('password123', '$2b$10$hashedpassword');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', '$2b$10$hashedpassword');
    });

    it('should return false for invalid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword('wrongpassword', '$2b$10$hashedpassword');

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all active users when includeInactive is false', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(false);

      expect(result).toHaveLength(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.isActive = :isActive', {
        isActive: true,
      });
    });

    it('should return all users including inactive when includeInactive is true', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(true);

      expect(result).toBeDefined();
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('user-123');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        relations: ['clinic'],
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com', isActive: true },
        relations: ['clinic'],
      });
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser', isActive: true },
        relations: ['clinic'],
      });
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('notfound');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user without changing password', async () => {
      const updateDto = { firstName: 'Updated', lastName: 'Name' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.update('user-123', updateDto);

      expect(result.firstName).toBe('Updated');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should update a user and hash new password', async () => {
      const updateDto = { password: 'newpassword123' };
      const newHashedPassword = '$2b$10$newhashedpassword';

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        passwordHash: newHashedPassword,
      });

      const result = await service.update('user-123', updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update('nonexistent', { firstName: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a user by setting isActive to false', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, isActive: false });

      await service.remove('user-123');

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    };

    it('should change password when current password is valid', async () => {
      const newHashedPassword = '$2b$10$newhashedpassword';

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        passwordHash: newHashedPassword,
      });

      await service.changePassword('user-123', changePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', mockUser.passwordHash);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.changePassword('nonexistent', changePasswordDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException when current password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword('user-123', changePasswordDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateLastLogin', () => {
    it('should update the last login timestamp', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateLastLogin('user-123');

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({ lastLogin: expect.any(Date) }),
      );
    });
  });
});
