# 🚀 FinZen - AI-Powered Financial Coaching Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

FinZen is a comprehensive financial coaching platform that combines AI-powered insights with UPI integration to help users manage their finances effectively.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Financial Insights** - Personalized spending analysis and recommendations
- **UPI Integration** - Seamless connection with GPay for transaction tracking
- **Smart Spending Coach** - AI-driven financial advice and coaching
- **Goal Tracking** - Set and monitor financial goals with progress tracking
- **Real-time Analytics** - Interactive charts and spending breakdowns
- **Loan Eligibility Calculator** - Instant loan eligibility assessment
- **Micro-Investment Guide** - Educational content for investment beginners

### 🔐 Security & Privacy
- **JWT Authentication** - Secure user authentication
- **Data Encryption** - All sensitive data encrypted in transit and at rest
- **Privacy-First** - GDPR and CCPA compliant privacy practices
- **Secure UPI Integration** - Safe payment processing

### 📱 User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Theme** - User preference-based theming
- **Real-time Updates** - Live transaction and balance updates
- **Intuitive Interface** - Clean, modern UI with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Socket.io** - Real-time communication

### AI & External Services
- **OpenAI GPT** - AI-powered financial insights
- **Hugging Face** - Alternative AI models
- **Twilio** - SMS/OTP services
- **GPay UPI API** - Payment integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/finzen.git
   cd finzen
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both `backend/` and `frontend/` directories:
   
   **Backend (.env)**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finzen
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   OPENAI_API_KEY=your_openai_key
   HUGGINGFACE_API_KEY=your_hf_key
   ```
   
   **Frontend (.env)**
   ```env
   VITE_API_BASE=http://localhost:5000/api
   ```

4. **Start development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory, in new terminal)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP

### Financial Data
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Add new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Insights & Analytics
- `GET /api/insights` - Get financial insights
- `GET /api/spending-breakdown` - Get spending analysis
- `GET /api/income` - Get income breakdown
- `GET /api/income-vs-expense` - Get income vs expense data

### AI Features
- `POST /api/spending-coach` - Get AI financial advice
- `POST /api/ai/spending-insight` - Get spending insights
- `GET /api/loan-eligibility` - Calculate loan eligibility

### UPI Integration
- `GET /upi/me` - Get UPI user details
- `GET /upi/transactions/:upiId` - Get UPI transactions

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `PORT` | Server port | No (default: 5000) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Yes |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Yes |

### CORS Configuration

The backend is configured to allow requests from:
- `https://finzen-z1gq.onrender.com` (deployed frontend)
- `http://localhost:5173` (local frontend)
- `http://localhost:5174` (local frontend alternative)

## 🚀 Deployment

### Backend Deployment

1. **Render (Recommended)**
   ```bash
   # Connect your GitHub repository to Render
   # Set build command: npm install
   # Set start command: npm start
   # Add environment variables
   ```

2. **Heroku**
   ```bash
   heroku create finzen-backend
   heroku config:set MONGO_URI=your_mongo_uri
   git push heroku main
   ```

3. **Railway**
   ```bash
   # Connect GitHub repo to Railway
   # Add environment variables
   # Auto-deploys on push
   ```

### Frontend Deployment

1. **Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npm run build
   # Deploy dist folder to Netlify
   ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

We take security seriously. Please report any security issues to security@finzen.com.

For more information, see our [Security Policy](SECURITY.md).

## 📞 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Email**: support@finzen.com
- **Discord**: [Join our community](link-to-discord)

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- GPay for UPI integration
- React and Node.js communities
- All contributors and supporters

---

**Made with ❤️ by the FinZen Team**

[Website](https://finzen.com) • [Documentation](https://docs.finzen.com) • [Support](https://support.finzen.com) 