import { Schema, model, Document } from 'mongoose';

export interface IFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  technicalAccuracy: string;
  communicationRating: string;
}

export interface IQuestion {
  questionText: string;
  difficulty: string;
  userAnswer?: string;
  feedback?: IFeedback;
  followUpQuestionText?: string;
  followUpAnswer?: string;
  followUpFeedback?: IFeedback;
}

export interface IFinalReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
}

const feedbackSchema = new Schema({
  score: { type: Number, required: true, min: 0, max: 10 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  technicalAccuracy: { type: String, required: true },
  communicationRating: { type: String, required: true },
});

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  difficulty: { type: String, required: true },
  userAnswer: { type: String },
  feedback: { type: feedbackSchema },
  followUpQuestionText: { type: String },
  followUpAnswer: { type: String },
  followUpFeedback: { type: feedbackSchema },
});

const finalReportSchema = new Schema({
  overallScore: { type: Number, required: true, min: 0, max: 10 },
  technicalScore: { type: Number, required: true, min: 0, max: 10 },
  communicationScore: { type: Number, required: true, min: 0, max: 10 },
  problemSolvingScore: { type: Number, required: true, min: 0, max: 10 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  recommendation: { 
    type: String, 
    enum: ['Strong Hire', 'Hire', 'Hold', 'No Hire'], 
    required: true 
  },
});

const interviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  },
  questions: [questionSchema],
  finalReport: { type: finalReportSchema },
}, {
  timestamps: true,
});

export const Interview = model('Interview', interviewSchema);
export default Interview;
