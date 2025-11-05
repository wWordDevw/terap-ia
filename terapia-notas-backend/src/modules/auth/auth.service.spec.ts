import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

// Mock bcrypt module
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const bcrypt = require('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: '$2b$10$hashedpassword',
    fullName: 'John Doe',
    role: UserRole.THERAPIST,
    isActive: true,
    clinicId: 'clinic-123',
    clinic: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    validatePassword: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
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
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset mocks
    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        'password123',
        mockUser.passwordHash,
      );
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return access and refresh tokens on successful login', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockUsersService.updateLastLogin.mockResolvedValue(undefined);
      mockJwtService.sign
        .mockReturnValueOnce('access_token_123')
        .mockReturnValueOnce('refresh_token_456');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_456',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          fullName: mockUser.fullName,
          role: mockUser.role,
          clinicId: mockUser.clinicId,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const payload = { sub: mockUser.id, email: mockUser.email };
      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new_access_token_789');

      const result = await service.refreshToken('valid_refresh_token');

      expect(result).toEqual({
        accessToken: 'new_access_token_789',
      });
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockUsersService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload = { sub: 'nonexistent-id', email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.refreshToken('valid_refresh_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result.fullName).toBe('John Doe');
      expect(result.role).toBe(UserRole.THERAPIST);
      expect(result.clinicId).toBe('clinic-123');
      expect(result.passwordHash).toBeUndefined();
      expect(mockUsersService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUsersService.findOne.mockRejectedValue(new Error('Usuario con ID nonexistent-id no encontrado'));

      await expect(service.getProfile('nonexistent-id')).rejects.toThrow();
    });
  });
});
