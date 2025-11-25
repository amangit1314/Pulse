import { Request, Response } from 'express';
import { OrganizationsService } from './organizations.service.js';

const organizationsService = new OrganizationsService();

export class OrganizationsController {
    async createOrganization(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const organization = await organizationsService.createOrganization({
                ...req.body,
                ownerId: req.user.userId,
            });

            res.status(201).json({
                success: true,
                message: 'Organization created successfully',
                data: organization,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create organization',
            });
        }
    }

    async getOrganization(req: Request, res: Response): Promise<void> {
        try {
            const organization = await organizationsService.getOrganizationById(
                req.params.orgId
            );

            res.json({
                success: true,
                data: organization,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Organization not found',
            });
        }
    }

    async getOrganizationBySlug(req: Request, res: Response): Promise<void> {
        try {
            const organization = await organizationsService.getOrganizationBySlug(
                req.params.slug
            );

            res.json({
                success: true,
                data: organization,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Organization not found',
            });
        }
    }

    async getUserOrganizations(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const organizations = await organizationsService.getUserOrganizations(
                req.user.userId
            );

            res.json({
                success: true,
                data: organizations,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch organizations',
            });
        }
    }

    async updateOrganization(req: Request, res: Response): Promise<void> {
        try {
            const organization = await organizationsService.updateOrganization(
                req.params.orgId,
                req.body
            );

            res.json({
                success: true,
                message: 'Organization updated successfully',
                data: organization,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update organization',
            });
        }
    }

    async deleteOrganization(req: Request, res: Response): Promise<void> {
        try {
            await organizationsService.deleteOrganization(req.params.orgId);

            res.json({
                success: true,
                message: 'Organization deleted successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete organization',
            });
        }
    }

    async addTeamMember(req: Request, res: Response): Promise<void> {
        try {
            const { userId, role } = req.body;
            const member = await organizationsService.addTeamMember(
                req.params.orgId,
                userId,
                role
            );

            res.status(201).json({
                success: true,
                message: 'Team member added successfully',
                data: member,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to add team member',
            });
        }
    }

    async removeTeamMember(req: Request, res: Response): Promise<void> {
        try {
            await organizationsService.removeTeamMember(
                req.params.orgId,
                req.params.userId
            );

            res.json({
                success: true,
                message: 'Team member removed successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to remove team member',
            });
        }
    }

    async updateTeamMemberRole(req: Request, res: Response): Promise<void> {
        try {
            const { role } = req.body;
            const member = await organizationsService.updateTeamMemberRole(
                req.params.orgId,
                req.params.userId,
                role
            );

            res.json({
                success: true,
                message: 'Team member role updated successfully',
                data: member,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update team member role',
            });
        }
    }

    async updateSubscription(req: Request, res: Response): Promise<void> {
        try {
            const { plan } = req.body;
            const organization = await organizationsService.updateSubscription(
                req.params.orgId,
                plan
            );

            res.json({
                success: true,
                message: 'Subscription updated successfully',
                data: organization,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update subscription',
            });
        }
    }

    async getAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analytics = await organizationsService.getOrganizationAnalytics(
                req.params.orgId
            );

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch analytics',
            });
        }
    }
}
