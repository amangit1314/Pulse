import axios from '../lib/axios';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    subscription: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
    subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'EXPIRED';
    aiFeatures: boolean;
    customBranding: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        events?: number;
        teamMembers?: number;
    };
}

export interface OrganizationTeamMember {
    id: string;
    userId: string;
    organizationId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    joinedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}

export interface CreateOrganizationDto {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface UpdateOrganizationDto {
    name?: string;
    slug?: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export const organizationsService = {
    async getAllOrganizations(): Promise<Organization[]> {
        const response = await axios.get('/organizations');
        return response.data.data;
    },

    async getOrganizationById(id: string): Promise<Organization> {
        const response = await axios.get(`/organizations/${id}`);
        return response.data.data;
    },

    async getOrganizationBySlug(slug: string): Promise<Organization> {
        const response = await axios.get(`/organizations/slug/${slug}`);
        return response.data.data;
    },

    async getUserOrganizations(): Promise<Organization[]> {
        const response = await axios.get('/organizations');
        return response.data.data;
    },

    async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
        const response = await axios.post('/organizations', data);
        return response.data.data;
    },

    async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<Organization> {
        const response = await axios.put(`/organizations/${id}`, data);
        return response.data.data;
    },

    async deleteOrganization(id: string): Promise<void> {
        await axios.delete(`/organizations/${id}`);
    },

    async getOrganizationAnalytics(id: string): Promise<any> {
        const response = await axios.get(`/organizations/${id}/analytics`);
        return response.data.data;
    },
};
