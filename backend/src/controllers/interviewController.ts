import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Interview from '../models/Interview';
import Resume from '../models/Resume';
import { 
  generateQuestions, 
  evaluateAnswer, 
  generateFinalReport 
} from '../config/gemini';

export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { role, difficulty } = req.body;
    const userId = req.user?.id;

    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty level are required.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    // Try to get user's latest resume
    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    let resumeText = '';
    if (latestResume) {
      resumeText = `Skills: ${latestResume.skillsMatched.join(', ')}. Experience Summary: ${latestResume.experienceSummary}`;
    }

    // Call Gemini API service to get questions
    const generated = await generateQuestions(role, difficulty, resumeText);

    // Format questions for Schema
    const questions = generated.map(qText => ({
      questionText: qText,
      difficulty,
    }));

    // Create session in Database
    const interview = await Interview.create({
      userId,
      role,
      difficulty,
      status: 'in_progress',
      questions,
    });

    res.status(201).json({
      message: 'Interview session started successfully.',
      interviewId: interview._id,
      role: interview.role,
      difficulty: interview.difficulty,
      questions: interview.questions.map((q, idx) => ({
        id: q._id,
        questionText: q.questionText,
        index: idx,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error starting interview.' });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { interviewId, questionIndex, answerText } = req.body;
    const userId = req.user?.id;

    if (interviewId === undefined || questionIndex === undefined || answerText === undefined) {
      return res.status(400).json({ message: 'Please provide interviewId, questionIndex, and answerText.' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (interview.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden. This is not your interview.' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ message: 'Invalid question index.' });
    }

    // Evaluate answer with Gemini AI
    const evaluation = await evaluateAnswer(question.questionText, answerText, interview.role);

    // Update interview question details
    question.userAnswer = answerText;
    question.feedback = {
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      technicalAccuracy: evaluation.technicalAccuracy,
      communicationRating: evaluation.communicationRating,
    };
    
    // Save generated follow up question (AI evaluation returns a followUpQuestionText)
    if (evaluation.followUpQuestionText) {
      question.followUpQuestionText = evaluation.followUpQuestionText;
    }

    await interview.save();

    res.status(200).json({
      message: 'Answer submitted and evaluated.',
      evaluation: question.feedback,
      followUpQuestionText: question.followUpQuestionText,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error submitting answer.' });
  }
};

export const submitFollowUpAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { interviewId, questionIndex, answerText } = req.body;
    const userId = req.user?.id;

    if (interviewId === undefined || questionIndex === undefined || answerText === undefined) {
      return res.status(400).json({ message: 'Please provide interviewId, questionIndex, and answerText.' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (interview.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const question = interview.questions[questionIndex];
    if (!question || !question.followUpQuestionText) {
      return res.status(400).json({ message: 'No follow up question found.' });
    }

    // Evaluate follow up answer
    const evaluation = await evaluateAnswer(question.followUpQuestionText, answerText, interview.role);

    question.followUpAnswer = answerText;
    question.followUpFeedback = {
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      technicalAccuracy: evaluation.technicalAccuracy,
      communicationRating: evaluation.communicationRating,
    };

    await interview.save();

    res.status(200).json({
      message: 'Follow-up answer submitted and evaluated.',
      evaluation: question.followUpFeedback,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error submitting follow-up answer.' });
  }
};

export const finishInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user?.id;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found.' });
    }

    if (interview.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    // Build input for report generation
    const questionsAndAnswers = interview.questions.map(q => ({
      questionText: q.questionText,
      userAnswer: q.userAnswer || undefined,
      feedback: q.feedback ? {
        score: q.feedback.score,
        strengths: q.feedback.strengths || [],
        weaknesses: q.feedback.weaknesses || [],
        technicalAccuracy: q.feedback.technicalAccuracy,
        communicationRating: q.feedback.communicationRating,
      } : undefined
    }));

    // Call Gemini API service to generate report
    const report = await generateFinalReport(interview.role, questionsAndAnswers);

    interview.finalReport = report;
    interview.status = 'completed';
    await interview.save();

    res.status(200).json({
      message: 'Interview finalized successfully.',
      interview,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error finalizing interview.' });
  }
};

export const getInterview = async (req: AuthRequest, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found.' });
    }

    if (interview.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    res.status(200).json(interview);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching interview details.' });
  }
};

export const getUserInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching interviews.' });
  }
};
