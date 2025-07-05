# 🚀 FinZen Backend Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] MongoDB Atlas database created
- [ ] Environment variables ready
- [ ] All dependencies installed (`npm install`)
- [ ] Start script added to package.json ✅
- [ ] Procfile created ✅
- [ ] CORS origins configured ✅

## 🔧 Required Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finzen
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_hf_key
```

## 🎯 Quick Deploy Options

### Option 1: Render (Recommended)
1. Go to [render.com](https://render.com)
2. Click "New Web Service"
3. Connect GitHub repo
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy!

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Add environment variables
4. Auto-deploys on push!

### Option 3: Heroku
1. Install Heroku CLI
2. `heroku create finzen-backend`
3. `heroku config:set MONGO_URI=your_uri`
4. `git push heroku main`

## 🔗 API URLs After Deployment

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-app-name.onrender.com/api`

## 📝 Update Frontend

After deployment, update `frontend/src/utils/api.js`:
```javascript
const API_BASE = "https://your-deployed-backend-url.com/api";
```

## 🧪 Test Deployment

1. Health check: `GET /` should return "🚀 FinZen Backend Running"
2. Test auth: `POST /api/auth/login`
3. Test protected route: `GET /api/user/profile` (with token) 