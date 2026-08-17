import jwt from 'jsonwebtoken';
import { User } from './auth.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { env } from '../../config/env.js';
import { IUser, JwtPayload } from '../../types/index.js';

export class AuthService {
  private generateAccessToken(user: IUser) {
    const payload: JwtPayload = {
      userId: String(user._id),
      role: user.role,
      email: user.email
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as any });
  }

  private generateRefreshToken(user: IUser) {
    const payload = { userId: String(user._id) };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as any });
  }

  async register(data: Partial<IUser>) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.badRequest('Email is already registered');
    }

    const user = await User.create(data);
    const userObj = user.toObject();
    delete userObj.password;

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user: userObj, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is disabled');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - custom method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    user.lastLogin = new Date();
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
      const user = await User.findById(decoded.userId);
      
      if (!user || user.refreshToken !== token) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      if (!user.isActive) {
        throw ApiError.forbidden('Account is disabled');
      }

      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

export const authService = new AuthService();
