import http from 'http';
import app from './app.js';
import { connectDB, env } from './config/index.js';
import { initSocket } from './socket/index.js';
import logger from './utils/logger.js';

const startServer = async () => {
  try {
    await connectDB();
    
    const server = http.createServer(app);
    initSocket(server);

    server.listen(env.PORT, () => {
      console.log(`
      =================================
      🚀 EduNexus AI Backend Running 🚀
      =================================
      Environment: ${env.NODE_ENV}
      Port: ${env.PORT}
      Client: ${env.CLIENT_URL}
      `);
    });

    // Handle graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // In production you might want to restart the process
  // process.exit(1);
});

startServer();
