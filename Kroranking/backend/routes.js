 import express from "express";
import { getAllDebaters, createDebater, getDebaterById, updateDebater, deleteDebater, loginAdmin,submitMatchResult } from "./controllers.js";
import  verifyToken  from "./authMiddleware.js";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
 
const router = express.Router();

// Add cookie middleware (if not already present)
router.use(cookieParser());


router.post("/admin/login", loginAdmin);
router.post('/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      console.error("Refresh token error:", err);
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    
    const newToken = jwt.sign(
      { id: decoded.id }, 
            process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );
    
    res.json({ token: newToken });
  });
});



router.get("/debaters", getAllDebaters);
router.post("/debaters", createDebater);

router.get("/debaters/:id", getDebaterById);  
router.put("/debaters/:id", verifyToken, updateDebater); 
router.delete("/debaters/:id", verifyToken, deleteDebater);

//router.post("/admin/login", loginAdmin);

router.post('/matches', verifyToken, submitMatchResult);




export default router;