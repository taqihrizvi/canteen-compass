import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { User } from '../types';

export class AuthService {
  async login(email: string, password: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user: User = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessTokenOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as StringValue
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue
    };

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      accessTokenOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      refreshTokenOptions
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as any;

      const accessTokenOptions: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as StringValue
      };

      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET as string,
        accessTokenOptions
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 403);
    }
  }

  async getCurrentUser(userId: number) {
    const result = await pool.query(
      'SELECT id, name, email, role, allergen_ids, dietary_preference_ids, created_at FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }

  async updateUserPreferences(userId: number, allergenIds: number[], dietaryPreferenceIds: number[]) {
    const result = await pool.query(
      'UPDATE users SET allergen_ids = $1, dietary_preference_ids = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND is_active = true RETURNING id, name, email, role, allergen_ids, dietary_preference_ids',
      [allergenIds, dietaryPreferenceIds, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }
}

export default new AuthService();
