import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import insightRoutes from "./routes/insightRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import mockTransactionRoutes from './routes/mockTransactionRoutes.js';
import upiRoutes from './routes/upiRoutes.js';
import incVsExpRoutes from './routes/incVsExpRoute.js'
import dashboardRoutes from './routes/dashboard.js';
import spendingCoachHf from './routes/spendingCoachHf.js';
import aiSpendingInsight from './routes/aiSpendingInsight.js';
import otpRoutes from './routes/otpRoutes.js';
import finzenApiRoutes from './routes/finzenApiRoutes.js';


const app = express();

// Middleware
const allowedOrigins = [
  "https://finzen-z1gq.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174" // <-- NO comma after the last item!
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', cardRoutes);
app.use("/api", insightRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/mock', mockTransactionRoutes);
app.use('/upi', upiRoutes);
app.use("/api", incVsExpRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/spending-coach-hf', spendingCoachHf);
app.use('/api/ai/spending-insight', aiSpendingInsight);
app.use('/api/otp', otpRoutes);
app.use('/api/v1', finzenApiRoutes);

// Health check
app.get('/', (req, res) => res.send('🚀 FinZen Backend Running'));

// DB + Server
connectDB();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room ${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Export io for use in controllers
export { io };

server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
