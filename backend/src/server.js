const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { getRedisClient } = require('./config/redis');
const env = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const environmentRoutes = require('./routes/environmentRoutes');
const secretRoutes = require('./routes/secretRoutes');
const auditRoutes = require('./routes/auditRoutes');
const tokenRoutes = require('./routes/tokenRoutes');

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'DevVault API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/environments', environmentRoutes);
app.use('/api/projects/:projectId/environments/:envId/secrets', secretRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/tokens', tokenRoutes);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    try {
      const redis = getRedisClient();
      await redis.connect();
    } catch (redisError) {
      console.warn('⚠️ Redis connection failed, continuing without cache:', redisError.message);
    }

    app.listen(env.PORT, () => {
      console.log(`🚀 DevVault API running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
