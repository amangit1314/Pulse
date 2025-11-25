import { Router } from 'express';
import { OrganizationsController } from './organizations.controller.js';
import { authenticate, authorize } from '../../core/middleware/auth.middleware.js';
import { validate } from '../../core/middleware/validation.middleware.js';
import { createOrganizationSchema, updateOrganizationSchema, addTeamMemberSchema, updateSubscriptionSchema, } from './organizations.validation.js';
const router = Router();
const organizationsController = new OrganizationsController();
// Public routes
router.get('/slug/:slug', organizationsController.getOrganizationBySlug.bind(organizationsController));
router.get('/:orgId', organizationsController.getOrganization.bind(organizationsController));
// Protected routes
router.use(authenticate);
router.get('/', organizationsController.getUserOrganizations.bind(organizationsController));
router.post('/', validate(createOrganizationSchema), organizationsController.createOrganization.bind(organizationsController));
router.put('/:orgId', authorize('ORGANIZER', 'ADMIN'), validate(updateOrganizationSchema), organizationsController.updateOrganization.bind(organizationsController));
router.delete('/:orgId', authorize('ORGANIZER', 'ADMIN'), organizationsController.deleteOrganization.bind(organizationsController));
// Team management
router.post('/:orgId/team', authorize('ORGANIZER', 'ADMIN'), validate(addTeamMemberSchema), organizationsController.addTeamMember.bind(organizationsController));
router.delete('/:orgId/team/:userId', authorize('ORGANIZER', 'ADMIN'), organizationsController.removeTeamMember.bind(organizationsController));
router.put('/:orgId/team/:userId/role', authorize('ORGANIZER', 'ADMIN'), organizationsController.updateTeamMemberRole.bind(organizationsController));
// Subscription
router.put('/:orgId/subscription', authorize('ORGANIZER', 'ADMIN'), validate(updateSubscriptionSchema), organizationsController.updateSubscription.bind(organizationsController));
// Analytics
router.get('/:orgId/analytics', authorize('ORGANIZER', 'ADMIN'), organizationsController.getAnalytics.bind(organizationsController));
export default router;
