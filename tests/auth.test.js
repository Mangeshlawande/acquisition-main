import { jest } from '@jest/globals';
import request from 'supertest';
import app from '#src/app.js';
import { jwttoken } from '#utils/jwt.js';
import {
  extractToken,
  authenticateToken,
  optionalAuthenticate,
  requireRole,
} from '#middleware/auth.middleware.js';

describe('Access Token Logic & Authentication', () => {
  const testPayload = {
    id: 1,
    email: 'admin@acquisitions.test',
    role: 'admin',
  };

  describe('JWT Utilities', () => {
    it('should sign and verify valid JWT token', () => {
      const token = jwttoken.sign(testPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);

      const decoded = jwttoken.verify(token);
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error when verifying invalid token', () => {
      expect(() => {
        jwttoken.verify('invalid.token.payload');
      }).toThrow('Failed to authenticate token');
    });
  });

  describe('Token Extraction Middleware (extractToken)', () => {
    it('should extract token from Authorization: Bearer <token> header', () => {
      const req = {
        headers: {
          authorization: 'Bearer sample-access-token-123',
        },
      };
      expect(extractToken(req)).toBe('sample-access-token-123');
    });

    it('should extract token from req.cookies.token', () => {
      const req = {
        cookies: {
          token: 'sample-cookie-token-456',
        },
      };
      expect(extractToken(req)).toBe('sample-cookie-token-456');
    });

    it('should return null when neither header nor cookie is present', () => {
      const req = { headers: {}, cookies: {} };
      expect(extractToken(req)).toBeNull();
    });

    it('should safely handle undefined cookies and headers', () => {
      const req = {};
      expect(extractToken(req)).toBeNull();
    });
  });

  describe('authenticateToken Middleware', () => {
    it('should attach req.user and call next when Bearer token is valid', () => {
      const token = jwttoken.sign(testPayload);
      const req = {
        headers: { authorization: `Bearer ${token}` },
      };
      const res = {};
      const next = jest.fn();

      authenticateToken(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user.id).toBe(testPayload.id);
      expect(req.user.email).toBe(testPayload.email);
    });

    it('should return 401 when no token is provided', () => {
      const req = { headers: {}, cookies: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authenticateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Authentication required',
          message: 'No access token provided',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid or corrupted', () => {
      const req = {
        headers: { authorization: 'Bearer bad.token.string' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authenticateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Authentication failed',
          message: 'Invalid or expired token',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuthenticate Middleware', () => {
    it('should populate req.user if a valid token is present', () => {
      const token = jwttoken.sign(testPayload);
      const req = {
        headers: { authorization: `Bearer ${token}` },
      };
      const next = jest.fn();

      optionalAuthenticate(req, {}, next);
      expect(next).toHaveBeenCalled();
      expect(req.user.email).toBe(testPayload.email);
    });

    it('should leave req.user undefined and proceed without error for guests', () => {
      const req = {};
      const next = jest.fn();

      optionalAuthenticate(req, {}, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });
  });

  describe('requireRole Middleware', () => {
    it('should allow access when user role matches allowed roles', () => {
      const req = { user: { role: 'admin', email: 'admin@test.com' } };
      const res = {};
      const next = jest.fn();

      requireRole(['admin'])(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 when user role is not in allowed roles', () => {
      const req = { user: { role: 'user', email: 'user@test.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      requireRole(['admin'])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when req.user is missing', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      requireRole(['admin'])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('HTTP Route Integration: /api/auth', () => {
    it('GET /api/auth/me should reject request without token with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Authentication required');
    });

    it('GET /api/auth/me should reject request with invalid Bearer token with 401', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Authentication failed');
    });

    it('POST /api/auth/sign-out should return 200 and clear token cookie', async () => {
      const res = await request(app).post('/api/auth/sign-out');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'message',
        'User signed out successfully'
      );
    });
  });
});
