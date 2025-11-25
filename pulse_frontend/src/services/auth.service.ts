import axios from '../lib/axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: any;
    accessToken: string;
    refreshToken: string;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await axios.post('/auth/register', data);
        return response.data.data;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axios.post('/auth/login', credentials);
        return response.data.data;
    },

    async logout(): Promise<void> {
        await axios.post('/auth/logout');
    },

    async getProfile(): Promise<any> {
        const response = await axios.get('/auth/profile');
        return response.data.data;
    },

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await axios.post('/auth/refresh', { refreshToken });
        return response.data.data;
    },
};
