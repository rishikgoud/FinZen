# FinZen Backend Deployment Guide

## Environment Variables Required

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/finzen?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Port
PORT=5000

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# Hugging Face (for AI features)
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## Deployment Platforms

### 1. Render (Recommended)
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in the dashboard

### 2. Heroku
1. Install Heroku CLI
2. Run: `heroku create finzen-backend`
3. Set environment variables: `heroku config:set MONGO_URI=your_mongo_uri`
4. Deploy: `git push heroku main`

### 3. Railway
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically

## API Endpoints

Once deployed, your API will be available at:
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-app-name.onrender.com/api` (or your deployed URL)

## CORS Configuration

The backend is configured to allow requests from:
- `https://finzen-z1gq.onrender.com` (deployed frontend)
- `http://localhost:5173` (local frontend)
- `http://localhost:5174` (local frontend alternative)

Update the `allowedOrigins` array in `index.js` if needed. 