# Environment Configuration Template
# Copy this to .env and fill in your actual values

DATABASE_URL="YOUR_POSTGRES_DB_URL"
PORT=4000
FRONTEND_URL="http://localhost:3000"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email Configuration (using Gmail SMTP as example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"
EMAIL_FROM="Pulse Events <noreply@pulse.events>"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"

# OpenAI Configuration
OPENAI_API_KEY="sk-your-openai-api-key"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"

# WebSocket/Socket.IO
SOCKET_IO_CORS_ORIGIN="http://localhost:3000"

# General
NODE_ENV="development"
APP_URL="http://localhost:4000"
