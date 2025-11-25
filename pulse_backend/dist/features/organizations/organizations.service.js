import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class OrganizationsService {
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            + '-' + Math.random().toString(36).substring(2, 8);
    }
    async createOrganization(data) {
        const slug = this.generateSlug(data.name);
        // Check if user already owns an organization
        const existingOrg = await prisma.organization.findFirst({
            where: { ownerId: data.ownerId },
        });
        if (existingOrg) {
            throw new Error('User already owns an organization');
        }
        // Create organization
        const organization = await prisma.organization.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                website: data.website,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country,
                ownerId: data.ownerId,
                subscription: 'FREE',
                subscriptionStatus: 'TRIAL',
                aiFeatures: false,
                virtualMeetups: true, // Free tier gets basic virtual meetups
                customBranding: false,
                analytics: true,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
        // Add owner as team member
        await prisma.organizationMember.create({
            data: {
                organizationId: organization.id,
                userId: data.ownerId,
                role: 'OWNER',
            },
        });
        // Update user role to ORGANIZER
        await prisma.user.update({
            where: { id: data.ownerId },
            data: { role: 'ORGANIZER' },
        });
        return organization;
    }
    async getOrganizationById(orgId) {
        const organization = await prisma.organization.findUnique({
            where: { id: orgId },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        events: true,
                        members: true,
                    },
                },
            },
        });
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    async getOrganizationBySlug(slug) {
        const organization = await prisma.organization.findUnique({
            where: { slug },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        events: true,
                        members: true,
                    },
                },
            },
        });
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    async getUserOrganizations(userId) {
        const memberships = await prisma.organizationMember.findMany({
            where: { userId },
            include: {
                organization: {
                    include: {
                        _count: {
                            select: {
                                events: true,
                                members: true,
                            },
                        },
                    },
                },
            },
        });
        return memberships.map((m) => ({
            ...m.organization,
            userRole: m.role,
        }));
    }
    async updateOrganization(orgId, data) {
        const organization = await prisma.organization.update({
            where: { id: orgId },
            data,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
        return organization;
    }
    async deleteOrganization(orgId) {
        await prisma.organization.delete({
            where: { id: orgId },
        });
        return { success: true };
    }
    async addTeamMember(orgId, userId, role = 'MEMBER') {
        // Check if member already exists
        const existing = await prisma.organizationMember.findUnique({
            where: {
                organizationId_userId: {
                    organizationId: orgId,
                    userId,
                },
            },
        });
        if (existing) {
            throw new Error('User is already a member of this organization');
        }
        const member = await prisma.organizationMember.create({
            data: {
                organizationId: orgId,
                userId,
                role: role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
        return member;
    }
    async removeTeamMember(orgId, userId) {
        await prisma.organizationMember.delete({
            where: {
                organizationId_userId: {
                    organizationId: orgId,
                    userId,
                },
            },
        });
        return { success: true };
    }
    async updateTeamMemberRole(orgId, userId, role) {
        const member = await prisma.organizationMember.update({
            where: {
                organizationId_userId: {
                    organizationId: orgId,
                    userId,
                },
            },
            data: {
                role: role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
        return member;
    }
    async updateSubscription(orgId, plan) {
        // Define features based on plan
        const features = {
            FREE: {
                aiFeatures: false,
                virtualMeetups: true,
                customBranding: false,
                analytics: true,
            },
            BASIC: {
                aiFeatures: false,
                virtualMeetups: true,
                customBranding: true,
                analytics: true,
            },
            PROFESSIONAL: {
                aiFeatures: true,
                virtualMeetups: true,
                customBranding: true,
                analytics: true,
            },
            ENTERPRISE: {
                aiFeatures: true,
                virtualMeetups: true,
                customBranding: true,
                analytics: true,
            },
        };
        const organization = await prisma.organization.update({
            where: { id: orgId },
            data: {
                subscription: plan,
                subscriptionStatus: 'ACTIVE',
                subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                ...features[plan],
            },
        });
        return organization;
    }
    async getOrganizationAnalytics(orgId) {
        const [totalEvents, upcomingEvents, pastEvents, totalBookings, totalRevenue] = await Promise.all([
            prisma.event.count({
                where: { organizationId: orgId },
            }),
            prisma.event.count({
                where: {
                    organizationId: orgId,
                    startTime: { gte: new Date() },
                    status: 'PUBLISHED',
                },
            }),
            prisma.event.count({
                where: {
                    organizationId: orgId,
                    endTime: { lt: new Date() },
                },
            }),
            prisma.booking.count({
                where: {
                    event: {
                        organizationId: orgId,
                    },
                },
            }),
            prisma.booking.aggregate({
                where: {
                    event: {
                        organizationId: orgId,
                    },
                    status: 'CONFIRMED',
                },
                _sum: {
                    totalAmount: true,
                },
            }),
        ]);
        // Get recent events
        const recentEvents = await prisma.event.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                startTime: true,
                endTime: true,
                status: true,
                viewCount: true,
                _count: {
                    select: {
                        bookings: true,
                    },
                },
            },
        });
        return {
            totalEvents,
            upcomingEvents,
            pastEvents,
            totalBookings,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            recentEvents,
        };
    }
}
