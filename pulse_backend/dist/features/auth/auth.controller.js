import { AuthService } from './auth.service.js';
const authService = new AuthService();
export class AuthController {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            const result = await authService.register({ email, password, name });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed',
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });
            res.json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Login failed',
            });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Token refresh failed',
            });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            const user = await authService.getProfile(req.user.userId);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'User not found',
            });
        }
    }
    async logout(req, res) {
        // For JWT, logout is handled client-side by removing the token
        // But we can add token blacklisting here if needed in the future
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    }
}
