import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { NotFoundException } from '@nestjs/common';

// Define a mock for the Mongoose model
const mockUserModel = {
  create: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(null),
  })),
  find: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue([]),
  })),
  findById: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(null),
  })),
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const email = 'nonexistent@example.com';
      await expect(service.findByEmail(email)).rejects.toThrow(NotFoundException);
    });

    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = { username: 'test', email, password: 'password' };
      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(user),
      }));
      const result = await service.findByEmail(email);
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const id = 'some-id';
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });

    it('should return a user if found', async () => {
      const id = 'some-id';
      const user = { username: 'test', email: 'test@example.com', password: 'password' };
      mockUserModel.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(user),
      }));
      const result = await service.findOne(id);
      expect(result).toEqual(user);
    });
  });
});
