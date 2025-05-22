import mongoose from "mongoose";

// Only keep Debater and Match models
const DebaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 1200 },
});

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


const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Optional: hash password before saving (still okay even without login)
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


export const Debater = mongoose.model('Debater', DebaterSchema);
export const Match = mongoose.model('Match', MatchSchema);
export const Admin = mongoose.model('Admin', AdminSchema);