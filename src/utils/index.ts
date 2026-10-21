import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../types';

/**
 * Utility untuk membuat JWT token
 */
export const generateToken = (payload: JwtUserPayload): string => {
    const secret = process.env.JWT_SECRET || 'rahasia_super_aman_jwt_secret_key_12345';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

/**
 * Utility untuk memverifikasi JWT token
 */
export const verifyToken = (token: string): JwtUserPayload => {
    const secret = process.env.JWT_SECRET || 'rahasia_super_aman_jwt_secret_key_12345';
    return jwt.verify(token, secret) as JwtUserPayload;
};
