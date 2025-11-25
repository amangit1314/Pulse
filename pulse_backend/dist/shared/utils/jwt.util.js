// File: src/utils/jwt.util.ts
import jwt from 'jsonwebtoken';
import { env } from '../../core/config/env.config.js'; // Replace with your correct path
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
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
};
// Generates a refresh token (long-lived)
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
};
// Verifies and decodes an access token
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired access token');
    }
};
// Verifies and decodes a refresh token
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
