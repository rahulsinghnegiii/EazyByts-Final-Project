import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventxpert'; 