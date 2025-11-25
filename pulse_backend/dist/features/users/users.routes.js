import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { validateBody } from '../../core/middleware/validation.middleware.js';
import { updateProfileSchema, updateNotificationPreferencesSchema, } from './users.validation.js';
const router = Router();
const usersController = new UsersController();
// All routes require authentication
router.use(authenticate);
// Profile management
router.get('/profile', usersController.getProfile.bind(usersController));
router.put('/profile', validateBody(updateProfileSchema), usersController.updateProfile.bind(usersController));
// Notification preferences
router.put('/preferences/notifications', validateBody(updateNotificationPreferencesSchema), usersController.updateNotificationPreferences.bind(usersController));
// Bookings
router.get('/bookings', usersController.getBookings.bind(usersController));
// Rewards
router.get('/rewards', usersController.getRewards.bind(usersController));
// Notifications
router.get('/notifications', usersController.getNotifications.bind(usersController));
router.put('/notifications/:notificationId/read', usersController.markNotificationAsRead.bind(usersController));
router.put('/notifications/read-all', usersController.markAllNotificationsAsRead.bind(usersController));
// Wishlist
router.get('/wishlist', usersController.getWishlist.bind(usersController));
router.post('/wishlist', usersController.addToWishlist.bind(usersController));
router.delete('/wishlist/:eventId', usersController.removeFromWishlist.bind(usersController));
export default router;
