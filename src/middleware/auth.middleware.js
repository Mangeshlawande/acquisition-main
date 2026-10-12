import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const extractToken = req => {
  if (req.headers?.authorization) {
    const parts = req.headers.authorization.trim().split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

export const optionalAuthenticate = (req, _res, _next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwttoken.verify(token);
      req.user = decoded;
    }
  } catch {
    // Silently continue for unauthenticated / guest requests
  }
  _next();
};

export const authenticateToken = (req, res, _next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No access token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
    _next();
  } catch (e) {
    logger.error('Authentication error:', e);

    if (e.message === 'Failed to authenticate token') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Error during authentication',
    });
  }
};

export const requireRole = allowedRoles => {
  return (req, res, _next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`
        );
        return res.status(403).json({
          error: 'Access denied',
          message: 'Insufficient permissions',
        });
      }

      _next();
    } catch (e) {
      logger.error('Role verification error:', e);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Error during role verification',
      });
    }
  };
};
