import { hashPassword, verifyPassword, generateToken, verifyToken, getUserFromToken } from '../lib/utils/auth';
import { IUser } from '../lib/models/User';
import mongoose from 'mongoose';

// Mock the JWT_SECRET
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword';
      const hashed = await hashPassword(password);
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(password);
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testpassword';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'testpassword';
      const hashed = await hashPassword(password);
      const isValid = await verifyPassword('wrongpassword', hashed);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId('user123'),
        email: 'test@example.com',
        role: 'user' as 'user',
        password: 'hashedpassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IUser;
      const token = generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const mockUser: IUser = {
        _id: new mongoose.Types.ObjectId('user123'),
        email: 'test@example.com',
        role: 'user',
        password: 'hashedpassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('user123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.role).toBe('user');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });

  describe('getUserFromToken', () => {
    it('should return user data from valid token', () => {
      const mockUser: IUser = {
        _id: 'user123',
        email: 'test@example.com',
        role: 'user',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const token = generateToken(mockUser);
      const user = getUserFromToken(token);
      expect(user).toBeDefined();
      expect(user?.userId).toBe('user123');
      expect(user?.email).toBe('test@example.com');
      expect(user?.role).toBe('user');
    });

    it('should return null for invalid token', () => {
      const user = getUserFromToken('invalid-token');
      expect(user).toBeNull();
    });
  });
});
