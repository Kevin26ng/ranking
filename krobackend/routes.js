import express from "express";
import { 
  getAllDebaters, 
  createDebater, 
  getDebaterById, 
  updateDebater, 
  deleteDebater,
  submitMatchResult 
} from "./controllers.js";

const router = express.Router();

// Public routes
router.get("/debaters", getAllDebaters);
router.post("/debaters", createDebater);
router.get("/debaters/:id", getDebaterById);
router.put("/debaters/:id", updateDebater);
router.delete("/debaters/:id", deleteDebater);
router.post("/matches", submitMatchResult);

export default router;