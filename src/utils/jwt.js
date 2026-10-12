import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET environment variable must be set in production'
    );
  }
  logger.warn(
    'JWT_SECRET is not set — using an insecure development-only fallback'
  );
  JWT_SECRET = 'development-only-insecure-jwt-secret';
}

const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error(`Failed to authenticate token : ${e}`);
      throw new Error('Failed to authenticate token ');
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      logger.error(`Failed to verify token: ${e}`);
      throw new Error('Failed to authenticate token');
    }
  },
};
