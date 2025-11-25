import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './core/config/env.config.js';
import { errorHandler, notFound } from './core/middleware/error.middleware.js';
import authRoutes from './features/auth/auth.routes.js';
import usersRoutes from './features/users/users.routes.js';
import eventsRoutes from './features/events/events.routes.js';
import organizationsRoutes from './features/organizations/organizations.routes.js';
import bookingsRoutes from './features/bookings/bookings.routes.js';
const app = express();
const httpServer = createServer(app);
// Socket.IO setup for real-time features
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: env.SOCKET_IO_CORS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});
// Middleware
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Pulse API is running' });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/bookings', bookingsRoutes);
// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    // Meeting room events
    socket.on('join-meeting', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
    });
    socket.on('leave-meeting', (roomId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user-left', socket.id);
    });
    // Chat events
    socket.on('send-message', (data) => {
        socket.to(data.roomId).emit('new-message', data.message);
    });
    // WebRTC signaling
    socket.on('webrtc-offer', (data) => {
        socket.to(data.roomId).emit('webrtc-offer', { offer: data.offer, from: socket.id });
    });
    socket.on('webrtc-answer', (data) => {
        socket.to(data.roomId).emit('webrtc-answer', { answer: data.answer, from: socket.id });
    });
    socket.on('webrtc-ice-candidate', (data) => {
        socket.to(data.roomId).emit('webrtc-ice-candidate', { candidate: data.candidate, from: socket.id });
    });
});
// Make io accessible to routes
app.set('io', io);
// Error handling
app.use(notFound);
app.use(errorHandler);
// Start server
const PORT = env.PORT;
httpServer.listen(PORT, () => {
    console.log(`🚀 Pulse API server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
    console.log(`📊 Environment: ${env.NODE_ENV}`);
    console.log(`💻 Health check: http://localhost:${PORT}/health`);
});
export default app;
