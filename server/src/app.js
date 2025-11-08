const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const connectDB = require('./config/connection.db');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const registerSocketHandlers = require('./presentation/socket/index');
const QuickPlayScheduler = require('./business/scheduler/quickPlayScheduler')

// Load environment variables first
dotenv.config();

// Database connection
connectDB();

// redis connection
const { connectRedis } = require('./config/connection.redis');
console.log(process.env.REDIS_URL, 'dssddssddsds')
connectRedis();

// Middleware
app.use(morgan('short'));
app.use(cors({
  origin: process.env.CLIENT_PORT || 'http://172.20.10.3:5173',
  credentials: true  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ CORRECTED ROUTE PATHS - All consistent
app.use('/api/user', require('./presentation/routes/user'));     
app.use('/api/lounge', require('./presentation/routes/lounge')); 
app.use('/api/room', require('./presentation/routes/room'));     
app.use('/api/game', require('./presentation/routes/game'));     
app.use('/api/auth', require('./presentation/routes/auth'));

// Error handling middleware (basic)
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_PORT || 'http://172.20.10.3:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

registerSocketHandlers(io);

const quickPlayScheduler = new QuickPlayScheduler(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // start the schedule process
  quickPlayScheduler.start()
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    quickPlayScheduler.stop()
  });
});