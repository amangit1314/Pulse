# Pulse - AI Event Marketplace Platform

## 🚀 Quick Start

### Backend Setup

1. **Install Dependencies**
```bash
cd pulse_backend
npm install
```

2. **Configure Environment**
Create a `.env` file in the `pulse_backend` directory with the following variables:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Server
PORT=4000
FRONTEND_URL="http://localhost:3000"

# JWT Secrets
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Optional: OAuth (if you want social login)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Optional: OpenAI (for AI features)
OPENAI_API_KEY="sk-your-openai-key"

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
```

3. **Setup Database**
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

4. **Start Backend Server**
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend Setup  

1. **Install Dependencies**
```bash
cd omnify_mini_event_management_system
npm install
```

2. **Configure Environment**
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

3. **Start Frontend**
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📋 What's Been Built

### Backend Features ✅

#### 1. **Database Schema** (Prisma)
- ✅ User Management (authentication, profiles, preferences, location)
- ✅ Organization Management (teams, subscriptions, branding)
- ✅ Event Management (in-person, virtual, hybrid events)
- ✅ Categories & Tags
- ✅ Booking & Payment System
- ✅ Virtual Meetup (video conferencing)
- ✅ Reviews & Ratings
- ✅ Rewards & Points System
- ✅ Notifications
- ✅ Wishlist
- ✅ Social Connections

#### 2. **Authentication System**
- ✅ Email/Password Registration & Login
- ✅ JWT Access & Refresh Tokens
- ✅ Password Hashing (bcrypt)
- ✅ Role-Based Access Control (USER, ORGANIZER, ADMIN)
- ✅ Authentication Middleware
- ⏳ OAuth Integration (Google, GitHub) - Schema ready
- ⏳ Email Verification - Schema ready
- ⏳ Password Reset - Schema ready

#### 3. **User Management**
- ✅ Get/Update User Profile
- ✅ Location Preferences
- ✅ User Interests
- ✅ Notification Preferences
- ✅ User Bookings
- ✅ Rewards & Points
- ✅ Notifications (get, mark as read)
- ✅ Wishlist (add/remove events)

#### 4. **Event Management**
- ✅ Create/Update/Delete Events
- ✅ Get Event by ID or Slug
- ✅ Advanced Search with Filters:
  - Text search (title, description, tags)
  - Event type (in-person, virtual, hybrid)
  - Location (city, country)
  - Date range
  - Price range
  - Categories
  - Tags
  - Featured events
- ✅ Location-Based Discovery:
  - Search events near user location
  - Distance calculation (Haversine formula)
  - Radius filtering
  - Bounding box optimization
- ✅ Featured Events
- ✅ Trending Events
- ✅ View Count Tracking
- ✅ Organization association

#### 5. **Core Infrastructure**
- ✅ Express.js Server
- ✅ Socket.IO Integration (real-time features)
- ✅ WebRTC Signaling (for video calls)
- ✅ CORS Configuration
- ✅ Error Handling Middleware
- ✅ Validation Middleware (Zod)
- ✅ JWT Utilities
- ✅ Password Utilities
- ✅ Location Utilities (distance calculations)
- ✅ Environment Configuration

### 🚧 Next Steps (Backend)

#### Phase 1: Organization Features
- [ ] Organization CRUD
- [ ] Organization Team Management
- [ ] Organization Dashboard Analytics
- [ ] Subscription Management

#### Phase 2: Bookings & Payments
- [ ] Create Booking
- [ ] Stripe Payment Integration
- [ ] Affiliate Link Tracking
- [ ] Booking Confirmation Emails
- [ ] Booking Cancellation & Refunds

#### Phase 3: Virtual Meetups
- [ ] Create/Schedule Virtual Meetups
- [ ] Meeting Room Management
- [ ] Chat Message Storage
- [ ] Recording Management
- [ ] AI Transcription Integration
- [ ] Meeting Summary Generation

#### Phase 4: Reviews & Ratings
- [ ] Submit Review
- [ ] Get Event Reviews
- [ ] Helpful Vote System

#### Phase 5: AI Features
- [ ] AI Chatbot (OpenAI integration)
- [ ] Event Recommendations
- [ ] Personalization Engine
- [ ] Attendance Prediction
- [ ] Pricing Optimization Suggestions

#### Phase 6: Additional Features
- [ ] Email Service (nodemailer)
- [ ] File Upload (multer)
- [ ] Categories Management
- [ ] Admin Panel APIs
- [ ] Analytics & Reporting

### Frontend Features (Next.js) - TO BUILD

The frontend needs to be built from scratch with:

1. **Design System**
   - Modern color palette
   - Typography system
   - Component library (shadcn-ui)
   - Animations

2. **Authentication Pages**
   - Login/Register
   - Password Reset
   - Email Verification

3. **User Dashboard**
   - Profile Management
   - My Bookings
   - My Rewards
   - Wishlist
   - Notifications

4. **Event Discovery**
   - Homepage with search
   - Event Listing with filters
   - Event Detail Page
   - Location-based map view

5. **Organization Dashboard**
   - Create/Manage Events
   - Analytics
   - Team Management

6. **Virtual Meetup Platform**
   - Video Conference Room
   - Chat
   - Screen Sharing
   - AI Features (transcription, summary)

7. **Booking Flow**
   - Ticket Selection
   - Payment (Stripe)
   - Confirmation

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Real-time**: Socket.IO
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Email**: Nodemailer
- **File Upload**: Multer

### Frontend (Planned)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **Forms**: React Hook Form + Zod
- **Maps**: Google Maps API
- **Video/Audio**: WebRTC, Simple-Peer

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences/notifications` - Update notification preferences
- `GET /api/users/bookings` - Get user bookings
- `GET /api/users/rewards` - Get user rewards
- `GET /api/users/notifications` - Get notifications
- `PUT /api/users/notifications/:id/read` - Mark notification as read
- `PUT /api/users/notifications/read-all` - Mark all notifications as read
- `GET /api/users/wishlist` - Get wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:eventId` - Remove from wishlist

### Events
- `GET /api/events/search` - Search events (with filters, location-based)
- `GET /api/events/featured` - Get featured events
- `GET /api/events/trending` - Get trending events
- `GET /api/events/:eventId` - Get event by ID
- `GET /api/events/slug/:slug` - Get event by slug
- `POST /api/events` - Create event (ORGANIZER/ADMIN)
- `PUT /api/events/:eventId` - Update event (ORGANIZER/ADMIN)
- `DELETE /api/events/:eventId` - Delete event (ORGANIZER/ADMIN)

## 🔑 Key Features

### 1. Location-Based Discovery
Events can be discovered based on user location using:
- Distance calculation (Haversine formula)
- Bounding box filtering for efficiency
- Radius search (default 50km, customizable)
- Sort by distance

### 2. Advanced Search
Powerful search with multiple filters:
- Full-text search
- Event type filtering
- Date range
- Price range
- Categories
- Location (city, country, or GPS coordinates)
- Featured/trending

### 3. Role-Based Access
- **USER**: Browse events, book tickets, leave reviews
- **ORGANIZER**: Create and manage events, view analytics
- **ADMIN**: Full platform access

### 4. Real-Time Features (Ready)
- Socket.IO integration for:
  - Live chat in virtual meetups
  - WebRTC signaling for video calls
  - Real-time notifications
  - Live event updates

### 5. Scalable Architecture
- Clean separation of concerns (routes -> controllers -> services)
- Middleware for authentication, validation, error handling
- Prisma ORM for type-safe database access
- Environment-based configuration

## 📊 Database Models

**Core Models**: User, Organization, Event, Booking, Payment, VirtualMeetup, Review, Reward, Notification, WishlistItem, Category, SocialConnection

**Total**: 15+ models with proper relations and indexes

## 🎯 Next Steps for Implementation

1. ✅ Backend foundation complete
2. 🚧 Add remaining backend features (organizations, bookings, payments)
3. 🚧 Build frontend with beautiful UI
4. 🚧 Integrate Socket.IO for real-time features
5. 🚧 Add AI features (chatbot, recommendations)
6. 🚧 Testing & deployment

---

**Built with ❤️ for modern event management**
