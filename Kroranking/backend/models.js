// models.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const DebaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 1200 },
});
const Debater = mongoose.models.Debater || mongoose.model("Debater", DebaterSchema);

// New: Admin schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema, 'admins');


// Add to models.js
const MatchSchema = new mongoose.Schema({
  govTeam: [{
    debaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debater' },
    score: Number
  }],
  oppTeam: [{
    debaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debater' },
    score: Number
  }],
  verdict: { type: String, enum: ['gov', 'opp'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Match = mongoose.model('Match', MatchSchema);
export { Debater, Admin, Match }; // Update export

//export { Debater, Admin };
