import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setTokenCookie(res, refreshToken);
    ApiResponse.success(res, { user, accessToken }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);
    setTokenCookie(res, refreshToken);
    ApiResponse.success(res, { user, accessToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw ApiError.unauthorized('No refresh token provided');
    }
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token);
    setTokenCookie(res, newRefreshToken);
    ApiResponse.success(res, { accessToken }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await authService.logout(req.user.userId);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.COOKIE_SAME_SITE,
    });
    ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized('Not authenticated');
    const user = await authService.getProfile(req.user.userId);
    ApiResponse.success(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};
