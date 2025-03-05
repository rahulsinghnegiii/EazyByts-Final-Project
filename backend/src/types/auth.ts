import { Request } from 'express';
import { IUser } from '../models/User';

export interface JwtPayload {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
} 