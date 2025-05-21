 import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import dbConnect from './lib.js';
import router from './routes.js'; 
import { Admin } from './models.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000; 
dotenv.config();

// Enhanced connection handler
const initializeServer = async () => {
  try {
    // 1. Connect to DB
    await dbConnect();
    console.log(' MongoDB connected');
    
    // 2. Create default admin (only after connection is ready)
    await createDefaultAdmin();
    
    // 3. Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(' Server startup failed:', err);
    process.exit(1);
  }
};

// Default admin creation (with more detailed logging)
const createDefaultAdmin = async () => {
  try {
    console.log(' Checking for existing admins...');
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        email: "admin@example.com",
        password: "admin123" // Will be hashed automatically
      });
      await defaultAdmin.save();
      console.log('Default admin created:', defaultAdmin.email);
      
      // Verify the admin exists
      const foundAdmin = await Admin.findOne({ email: "admin@example.com" });
      console.log(foundAdmin ? ' Verification passed' : ' Verification failed');
    } else {
      console.log(`i Found ${adminCount} existing admin(s)`);
    }
  } catch (err) {
    console.error(' Admin creation error:', err.message);
    if (err.code === 11000) {
      console.log(' Duplicate key error - admin already exists');
    }
  }
};

app.use(cookieParser());

const allowedOrigins = [
  'https://kroranking.netlify.app',
  //'http://localhost:5173' 
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST","DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use(router);
app.get('/', (_req, res) => {
  res.send('BACKEND WORKING WITH CORS + JSON');
});

// Add this to server.js before app.listen()
app.get('/debug-admins', async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 }); // Excludes password
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/debug-check-password', async (req, res) => {
  const admin = await Admin.findOne({ email: "admin@example.com" });
  if (!admin) return res.status(404).json({ error: "Admin not found" });
  
  const isMatch = await bcrypt.compare("admin123", admin.password);
  res.json({ 
    passwordMatches: isMatch,
    hint: isMatch ? " Use password 'admin123'" : " Password is NOT 'admin123'"
  });
});


app.get('/reset-admin', async (req, res) => {
  await Admin.deleteMany({});
  const newAdmin = new Admin({
    email: "admin@example.com",
    password: "admin123" // Will auto-hash
  });
  await newAdmin.save();
  res.json({ message: "Admin reset complete" });
});




// Start everything
initializeServer();