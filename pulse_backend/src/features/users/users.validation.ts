import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        bio: z.string().max(500).optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        radius: z.number().min(1).max(500).optional(),
        interests: z.array(z.string()).optional(),
        language: z.string().optional(),
        timezone: z.string().optional(),
        currency: z.string().optional(),
    }),
});

export const updateNotificationPreferencesSchema = z.object({
    body: z.object({
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        eventReminders: z.boolean().optional(),
        marketingEmails: z.boolean().optional(),
    }),
});
