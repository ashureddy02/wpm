const mongoose = require('mongoose');

// ✅ Use MongoDB Atlas if available, otherwise use local MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Loc8r';

// ✅ Connect to MongoDB
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ Mongoose connected to ${dbURI}`))
  .catch((err) => console.error('❌ Mongoose connection error:', err));

// ✅ Connection events (for debugging)
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

// ✅ Graceful shutdown function
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`🔒 Mongoose disconnected through ${msg}`);
    callback();
  });
};

// 🔁 For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// 🛑 For app termination (Ctrl + C)
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// ☁️ For Render / Heroku shutdown
process.on('SIGTERM', () => {
  gracefulShutdown('Render app shutdown', () => {
    process.exit(0);
  });
});

