import { Schema, model } from 'mongoose';

const resumeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  skillsMatched: [{ type: String }],
  missingSkills: [{ type: String }],
  strengthScore: { type: Number, required: true, min: 0, max: 100 },
  experienceSummary: { type: String },
  suggestions: [{ type: String }],
}, {
  timestamps: true,
});

export const Resume = model('Resume', resumeSchema);
export default Resume;
