import {
  signup,
  signin,
  signout,
  getMe,
} from '#controllers/auth.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);
router.get('/me', authenticateToken, getMe);

export default router;
