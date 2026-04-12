import mongoose from 'mongoose';
import dns from 'dns';

// Some VPN/proxy tools (McAfee, etc.) redirect Node's DNS to 127.0.0.1,
// which breaks MongoDB Atlas SRV lookups. Override to public resolvers.
const nodeDns = dns.getServers();
if (nodeDns.some(s => s === '127.0.0.1' || s === '::1')) {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 10000 : 6000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);

    mongoose.connection.on('error', err => console.error('MongoDB error:', err.message));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    }
    await _startMemoryServer();
  }
};

async function _startMemoryServer() {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.warn('Using in-memory MongoDB — data resets on restart');
  } catch (err) {
    console.error('In-memory MongoDB failed:', err.message);
    process.exit(1);
  }
}

export default connectDB;
