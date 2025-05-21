import { Debater, Admin,Match } from "./models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Admin login
export const loginAdmin = async (req, res) => {
   console.log("Login request received:", req.body);
 
  try {
     const { email, password } = req.body;
    const admin = await Admin.findOne({ email});
    console.log("Admin found:", admin?.username);  
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set HTTP-only cookie
     const refreshToken = jwt.sign({ id: admin._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
      res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 1. Get all debaters
export const getAllDebaters = async (req, res) => {
  try {
    const debaters = await Debater.find().sort({ rating: -1 }); // Sorted by rating
    res.status(200).json(debaters);
  } catch (error) {
    console.error("Get all debaters error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Create a new debater
export const createDebater = async (req, res) => {
  try {
    const { name, rating } = req.body;
    const newDebater = new Debater({ name, rating });
    await newDebater.save();
    res.status(201).json(newDebater);
  } catch (error) {
    console.error("Create debater error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Get single debater by ID
export const getDebaterById = async (req, res) => {
  try {
    const debater = await Debater.findById(req.params.id);
    if (!debater) return res.status(404).json({ error: "Debater not found" });
    res.status(200).json(debater);
  } catch (error) {
    console.error("Get debater by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 4. Update debater by ID
export const updateDebater = async (req, res) => {
  try {
    const updatedDebater = await Debater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document
    );
    if (!updatedDebater) return res.status(404).json({ error: "Debater not found" });
    res.status(200).json(updatedDebater);
  } catch (error) {
    console.error("Update debater error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 5. Delete debater by ID
export const deleteDebater = async (req, res) => {
  try {
    const deletedDebater = await Debater.findByIdAndDelete(req.params.id);
    if (!deletedDebater) return res.status(404).json({ error: "Debater not found" });
    res.status(200).json({ message: "Debater deleted" });
  } catch (error) {
    console.error("Delete debater error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const submitMatchResult = async (req, res) => {
  try {
    const { govTeam, oppTeam, verdict } = req.body;

    // 1. Validate input
    if (!govTeam || !oppTeam || !verdict) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Calculate new ratings (simplified Elo)
    const K = 20;
    const govIds = govTeam.map(d => d.debaterId);
    const oppIds = oppTeam.map(d => d.debaterId);

    const govDebaters = await Debater.find({ _id: { $in: govIds } });
    const oppDebaters = await Debater.find({ _id: { $in: oppIds } });

    const govAvg = govDebaters.reduce((sum, d) => sum + d.rating, 0) / govTeam.length;
    const oppAvg = oppDebaters.reduce((sum, d) => sum + d.rating, 0) / oppTeam.length;

    // 3. Update ratings
    const updates = [];
    
    govDebaters.forEach((debater, i) => {
      const expected = 1 / (1 + 10 ** ((oppAvg - debater.rating) / 400));
      const scoreDiff = govTeam[i].score - 75; // Baseline score adjustment
      const newRating = Math.round(debater.rating + K * ((verdict === 'gov' ? 1 : 0) - expected) + scoreDiff * 0.3);
      updates.push({ debater, newRating });
    });

    oppDebaters.forEach((debater, i) => {
  const expected = 1 / (1 + 10 ** ((govAvg - debater.rating) / 400));
  const scoreDiff = oppTeam[i].score - 75;
  const newRating = Math.round(debater.rating + K * ((verdict === 'opp' ? 1 : 0) - expected) + scoreDiff * 0.3);
  updates.push({ debater, newRating });
});


    // 4. Save updates
    await Promise.all(
      updates.map(({ debater, newRating }) => 
        Debater.updateOne({ _id: debater._id }, { rating: newRating })
    ));

    // 5. Record match
    await new Match({ govTeam, oppTeam, verdict }).save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
