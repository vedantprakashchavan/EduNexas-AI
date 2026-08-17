import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { UserRole } from '../types/index.js';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Not authorized to access this resource'));
    }

    next();
  };
};
