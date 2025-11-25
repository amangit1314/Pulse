import { z } from 'zod';

export const createOrganizationSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Organization name must be at least 2 characters'),
        description: z.string().optional(),
        website: z.string().url().optional(),
        email: z.string().email('Invalid email address'),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
    }),
});

export const updateOrganizationSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        website: z.string().url().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
    }),
});

export const addTeamMemberSchema = z.object({
    body: z.object({
        userId: z.string().min(1, 'User ID is required'),
        role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).default('MEMBER'),
    }),
});

export const updateSubscriptionSchema = z.object({
    body: z.object({
        plan: z.enum(['FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
    }),
});
