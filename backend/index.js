// ✅ Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/db.js';

// ✅ Optional: Safe FinZen sync import
try {
  await import('./services/finzenSync.js');
  console.log('🔄 Background FinZen sync started ✅');
} catch (error) {
  console.warn('⚠️ FinZen sync service failed to start:', error.message);
}

// ✅ Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import mockTransactionRoutes from './routes/mockTransactionRoutes.js';
import upiRoutes from './routes/upiRoutes.js';
import incVsExpRoutes from './routes/incVsExpRoute.js';
import dashboardRoutes from './routes/dashboard.js';
import spendingCoachHf from './routes/spendingCoachHf.js';
import aiSpendingInsight from './routes/aiSpendingInsight.js';
import otpRoutes from './routes/otpRoutes.js';
import finzenApiRoutes from './routes/finzenApiRoutes.js';

const app = express();

// ✅ Define allowed frontend origins
const allowedOrigins = [
  "https://finzen-z1gq.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL // optional dynamic env
].filter(Boolean);

// ✅ Configure dynamic CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', cardRoutes);
app.use('/api', insightRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/mock', mockTransactionRoutes);
app.use('/upi', upiRoutes);
app.use('/api', incVsExpRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/spending-coach-hf', spendingCoachHf);
app.use('/api/ai/spending-insight', aiSpendingInsight);
app.use('/api/otp', otpRoutes);
app.use('/api/v1', finzenApiRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({
    status: '🚀 FinZen Backend Running',
    timestamp: new Date().toISOString(),
    frontendAllowedOrigins: allowedOrigins,
  });
});

// ✅ Create HTTP server and Socket.IO
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO CORS blocked: " + origin));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`🔁 ${socket.id} joined room ${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// ✅ Export io if used in other files
export { io };

// ✅ Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT} or on Render`);
});
