import { OrganizationsService } from './organizations.service.js';
const organizationsService = new OrganizationsService();
export class OrganizationsController {
    async createOrganization(req, res) {
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create organization',
            });
        }
    }
    async getOrganization(req, res) {
        try {
            const organization = await organizationsService.getOrganizationById(req.params.orgId);
            res.json({
                success: true,
                data: organization,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Organization not found',
            });
        }
    }
    async getOrganizationBySlug(req, res) {
        try {
            const organization = await organizationsService.getOrganizationBySlug(req.params.slug);
            res.json({
                success: true,
                data: organization,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Organization not found',
            });
        }
    }
    async getUserOrganizations(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            const organizations = await organizationsService.getUserOrganizations(req.user.userId);
            res.json({
                success: true,
                data: organizations,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch organizations',
            });
        }
    }
    async updateOrganization(req, res) {
        try {
            const organization = await organizationsService.updateOrganization(req.params.orgId, req.body);
            res.json({
                success: true,
                message: 'Organization updated successfully',
                data: organization,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update organization',
            });
        }
    }
    async deleteOrganization(req, res) {
        try {
            await organizationsService.deleteOrganization(req.params.orgId);
            res.json({
                success: true,
                message: 'Organization deleted successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete organization',
            });
        }
    }
    async addTeamMember(req, res) {
        try {
            const { userId, role } = req.body;
            const member = await organizationsService.addTeamMember(req.params.orgId, userId, role);
            res.status(201).json({
                success: true,
                message: 'Team member added successfully',
                data: member,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to add team member',
            });
        }
    }
    async removeTeamMember(req, res) {
        try {
            await organizationsService.removeTeamMember(req.params.orgId, req.params.userId);
            res.json({
                success: true,
                message: 'Team member removed successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to remove team member',
            });
        }
    }
    async updateTeamMemberRole(req, res) {
        try {
            const { role } = req.body;
            const member = await organizationsService.updateTeamMemberRole(req.params.orgId, req.params.userId, role);
            res.json({
                success: true,
                message: 'Team member role updated successfully',
                data: member,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update team member role',
            });
        }
    }
    async updateSubscription(req, res) {
        try {
            const { plan } = req.body;
            const organization = await organizationsService.updateSubscription(req.params.orgId, plan);
            res.json({
                success: true,
                message: 'Subscription updated successfully',
                data: organization,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update subscription',
            });
        }
    }
    async getAnalytics(req, res) {
        try {
            const analytics = await organizationsService.getOrganizationAnalytics(req.params.orgId);
            res.json({
                success: true,
                data: analytics,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch analytics',
            });
        }
    }
}
