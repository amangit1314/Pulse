import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../../shared/utils/password.util.js';
import { generateAccessToken, generateRefreshToken } from '../../shared/utils/jwt.util.js';
const prisma = new PrismaClient();
export class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const hashedPassword = await hashPassword(data.password);
        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: 'USER',
                authProvider: 'EMAIL',
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                emailVerified: true,
                createdAt: true,
            },
        });
        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user || !user.password) {
            throw new Error('Invalid email or password');
        }
        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }
        // Verify password
        const isValidPassword = await comparePassword(data.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(oldRefreshToken) {
        try {
            // Verify the refresh token
            const { verifyRefreshToken } = await import('../../shared/utils/jwt.util.js');
            const payload = verifyRefreshToken(oldRefreshToken);
            // Get latest user data
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            });
            if (!user || !user.isActive) {
                throw new Error('User not found or inactive');
            }
            // Generate new tokens
            const accessToken = generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            const refreshToken = generateRefreshToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                bio: true,
                role: true,
                emailVerified: true,
                city: true,
                country: true,
                latitude: true,
                longitude: true,
                radius: true,
                interests: true,
                language: true,
                timezone: true,
                currency: true,
                rewardPoints: true,
                referralCode: true,
                createdAt: true,
                emailNotifications: true,
                pushNotifications: true,
                eventReminders: true,
                marketingEmails: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    // TODO: Implement email verification
    async sendVerificationEmail(userId) {
        // This will be implemented when we add email service
        throw new Error('Not implemented yet');
    }
    // TODO: Implement password reset
    async sendPasswordResetEmail(email) {
        // This will be implemented when we add email service
        throw new Error('Not implemented yet');
    }
}
