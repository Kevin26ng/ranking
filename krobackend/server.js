import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dbConnect from './lib.js';
import router from './routes.js'; 
import { Admin } from './models.js';

const app = express();
const PORT = 3000;
dotenv.config();

const initializeServer = async () => {
  try {
    await dbConnect();
    console.log('MongoDB connected');
    await createDefaultAdmin();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    console.log('Checking for existing admins...');
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        email: "admin@example.com",
        password: "admin123" // Still hashed if schema uses pre-save hook
      });
      await defaultAdmin.save();
      console.log('Default admin created:', defaultAdmin.email);
    } else {
      console.log(`Found ${adminCount} existing admin(s)`);
    }
  } catch (err) {
    console.error('Admin creation error:', err.message);
    if (err.code === 11000) {
      console.log('Duplicate key error - admin already exists');
    }
  }
};

app.use(cookieParser());

const allowedOrigins = [
  'https://kroranking.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use(router);

// Basic test route
app.get('/', (_req, res) => {
  res.send('BACKEND WORKING WITH CORS + JSON');
});

// Debug: list admins (no passwords)
app.get('/debug-admins', async (_req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset admin (useful for dev)
app.get('/reset-admin', async (_req, res) => {
  await Admin.deleteMany({});
  const newAdmin = new Admin({
    email: "admin@example.com",
    password: "admin123"
  });
  await newAdmin.save();
  res.json({ message: "Admin reset complete" });
});

initializeServer();
