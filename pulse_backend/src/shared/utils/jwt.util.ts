// File: src/utils/jwt.util.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../core/config/env.config.js'; // Replace with your correct path

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

// Validate secrets and expirations at runtime
if (typeof env.JWT_SECRET !== "string" || !env.JWT_SECRET)
    throw new Error("JWT_SECRET must be a non-empty string");
if (typeof env.JWT_EXPIRES_IN !== "string" && typeof env.JWT_EXPIRES_IN !== "number")
    throw new Error("JWT_EXPIRES_IN must be string (like '30m') or number (seconds)");
if (typeof env.JWT_REFRESH_SECRET !== "string" || !env.JWT_REFRESH_SECRET)
    throw new Error("JWT_REFRESH_SECRET must be a non-empty string");
if (typeof env.JWT_REFRESH_EXPIRES_IN !== "string" && typeof env.JWT_REFRESH_EXPIRES_IN !== "number")
    throw new Error("JWT_REFRESH_EXPIRES_IN must be string or number");

// Generates an access token (short-lived)
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any,
    });
};

// Generates a refresh token (long-lived)
export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
};

// Verifies and decodes an access token
export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

// Verifies and decodes a refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
