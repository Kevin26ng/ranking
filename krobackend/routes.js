import express from "express";
import { 
  getAllDebaters, 
  createDebater, 
  getDebaterById, 
  updateDebater, 
  deleteDebater,
  submitMatchResult, 
   getAllAdjudicators,
  createAdjudicator,
  getAdjudicatorById,
  updateAdjudicator,
  deleteAdjudicator
} from "./controllers.js";

const router = express.Router();

// Public routes
router.get("/debaters", getAllDebaters);
router.post("/debaters", createDebater);
router.get("/debaters/:id", getDebaterById);
router.put("/debaters/:id", updateDebater);
router.delete("/debaters/:id", deleteDebater);
router.post("/matches", submitMatchResult);

// Adjudicator routes
router.get("/adjudicators", getAllAdjudicators);
router.post("/adjudicators", createAdjudicator);
router.get("/adjudicators/:id", getAdjudicatorById);
router.put("/adjudicators/:id", updateAdjudicator);
router.delete("/adjudicators/:id", deleteAdjudicator);


export default router;