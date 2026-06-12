import dotenv from 'dotenv';

dotenv.config();

// We use GoogleGenAI from the official package if key exists.
// Since the package structure can sometimes vary (some versions use GoogleGenAI, others GoogleGenerativeAI),
// we will handle it dynamically or import GoogleGenerativeAI.
// Let's use standard import.
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: any = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI Service initialized with API key.');
  } catch (err) {
    console.error('Error initializing Gemini AI SDK:', err);
  }
} else {
  console.log('Gemini AI API Key not found or empty. Using High-Fidelity Mock AI Fallback Service.');
}

// Interfaces
export interface IEvalResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  technicalAccuracy: string;
  communicationRating: string;
  followUpQuestionText?: string;
}

export interface IReportResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
}

export interface IRoadmapResult {
  weakSkill: string;
  resources: {
    title: string;
    type: 'article' | 'video' | 'course';
    url: string;
  }[];
}

export interface IResumeResult {
  strengthScore: number;
  skillsMatched: string[];
  missingSkills: string[];
  experienceSummary: string;
  suggestions: string[];
}

// ----------------------------------------------------
// MOCK SERVICE DATA
// ----------------------------------------------------
const MOCK_QUESTIONS: Record<string, Record<string, string[]>> = {
  'frontend developer': {
    easy: [
      'Explain the difference between let, const, and var in JavaScript.',
      'What are semantic HTML tags and why are they important for SEO?',
      'How does the useState hook work in React?',
    ],
    medium: [
      'Explain the Virtual DOM and how React renders changes to the UI.',
      'How do you manage global state in a complex React application?',
      'Explain React lifecycle methods or hooks and how to handle side effects.',
    ],
    hard: [
      'Explain the inner workings of React Fiber and concurrent rendering.',
      'How would you optimize a React application that is suffering from heavy re-renders?',
      'Design a custom hook in React that throttles state updates and explain how you handle closure issues.',
    ]
  },
  'backend developer': {
    easy: [
      'What is the difference between SQL and NoSQL databases?',
      'Explain the role of middleware in an Express.js application.',
      'What are REST API design principles?',
    ],
    medium: [
      'How does JWT authentication work, and how do you secure access/refresh tokens?',
      'Explain database indexing and how it improves query performance.',
      'How would you handle race conditions or concurrency issues in Node.js?',
    ],
    hard: [
      'Design a horizontal scaling strategy for a high-traffic Express backend using Redis and clustering.',
      'Explain the difference between SQL transactions (ACID properties) and MongoDB transactions.',
      'How would you design a rate limiter middleware from scratch for a distributed system?',
    ]
  },
  'ai engineer': {
    easy: [
      'What is the difference between supervised and unsupervised learning?',
      'What is a Loss Function and why is it used?',
      'Explain what LLM stands for and name two common architectures.',
    ],
    medium: [
      'Explain the self-attention mechanism in Transformer architectures.',
      'How does retrieval-augmented generation (RAG) work, and how does it prevent LLM hallucination?',
      'Compare fine-tuning an LLM to prompt engineering/RAG. When would you use which?',
    ],
    hard: [
      'Explain the mathematical formulation of backpropagation in deep neural networks.',
      'Design a system to evaluate and monitor LLM drift and bias in a production setting.',
      'How would you optimize transformer inference latency for real-time applications (e.g. quantization, flash attention)?',
    ]
  }
};

const DEFAULT_MOCKS = {
  easy: [
    'What is your favorite programming language and why?',
    'What is a version control system like Git used for?',
    'Explain what an API is in simple terms.',
  ],
  medium: [
    'Describe a time you solved a challenging technical bug. What was your process?',
    'Explain the concept of Object-Oriented Programming (OOP) and its key pillars.',
    'How do you handle error boundaries and logging in production code?',
  ],
  hard: [
    'Design a scalable URL shortener system (like Bitly) and describe the database and caching layer.',
    'Explain how you would handle microservices authentication in a kubernetes cluster.',
    'What is your strategy for optimizing database queries and indexes on tables with millions of records?',
  ]
};

// Helper to clean up Markdown codeblocks in Gemini responses
function cleanJSONString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// ----------------------------------------------------
// PUBLIC GEMINI WRAPPER METHODS
// ----------------------------------------------------

export async function generateQuestions(
  role: string,
  difficulty: 'easy' | 'medium' | 'hard',
  resumeText?: string
): Promise<string[]> {
  const normRole = role.toLowerCase();
  
  if (!genAI) {
    // Return mock questions
    const category = MOCK_QUESTIONS[normRole] || MOCK_QUESTIONS['frontend developer'];
    return category[difficulty] || DEFAULT_MOCKS[difficulty];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert technical interviewer.
      Generate 3 highly relevant interview questions for a candidate interviewing for the role: "${role}" at a "${difficulty}" difficulty level.
      ${resumeText ? `Incorporate skills or experience mentioned in their resume: "${resumeText.substring(0, 1500)}"` : ''}
      
      Respond ONLY with a valid JSON array of strings, containing exactly 3 questions. No markup, no markdown formatting blocks, no conversational preamble.
      Example format:
      [
        "Question 1?",
        "Question 2?",
        "Question 3?"
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSONString(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in Gemini generateQuestions, using fallback:', error);
    const category = MOCK_QUESTIONS[normRole] || MOCK_QUESTIONS['frontend developer'];
    return category[difficulty] || DEFAULT_MOCKS[difficulty];
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  role: string
): Promise<IEvalResult> {
  if (!genAI) {
    // Generate high-quality mock evaluation
    const score = Math.floor(Math.random() * 4) + 6; // 6 to 9
    return {
      score,
      strengths: [
        'Demonstrates clear understanding of fundamental terms.',
        'Structured response with direct examples.'
      ],
      weaknesses: [
        'Could include more details on production edge-cases.',
        'Did not fully explain scaling implications.'
      ],
      technicalAccuracy: `A sound explanation of ${role === 'AI Engineer' ? 'AI models' : 'coding patterns'}. However, it missed mentioning deep architectural optimizations.`,
      communicationRating: score > 7 ? 'Fluent and professional' : 'Good explanation, but could use more concise terminology.',
      followUpQuestionText: `Can you elaborate on how you would implement or scale this solution in a production environment under heavy load?`
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert technical interviewer evaluating a candidate's answer.
      Role being interviewed: "${role}".
      Question: "${question}"
      Candidate Answer: "${answer}"

      Evaluate the candidate's answer and respond with a valid JSON object matching the following TypeScript interface:
      interface IEvalResult {
        score: number; // integer score from 0 to 10
        strengths: string[]; // 1 to 3 items
        weaknesses: string[]; // 1 to 3 items
        technicalAccuracy: string; // brief description of technical correctness
        communicationRating: string; // brief review of communication style
        followUpQuestionText: string; // a relevant, intelligent follow-up question based on their response
      }

      Respond ONLY with the JSON object. Do not include markdown codeblocks (like \`\`\`json).
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSONString(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in Gemini evaluateAnswer, using fallback:', error);
    return {
      score: 7,
      strengths: ['Addressed the core question', 'Structured articulation'],
      weaknesses: ['Missed corner cases'],
      technicalAccuracy: 'Matches fundamental definitions correctly.',
      communicationRating: 'Clear structure but slightly brief.',
      followUpQuestionText: 'How would you measure the performance of this approach in a real-world scenario?'
    };
  }
}

export async function generateFinalReport(
  role: string,
  questionsAndAnswers: { questionText: string; userAnswer?: string; feedback?: IEvalResult }[]
): Promise<IReportResult> {
  if (!genAI) {
    // Compute scores
    const evaluations = questionsAndAnswers.filter(q => q.feedback);
    const sumScores = evaluations.reduce((acc, q) => acc + (q.feedback?.score || 0), 0);
    const avgScore = evaluations.length ? parseFloat((sumScores / evaluations.length).toFixed(1)) : 7.0;
    
    const techScore = Math.min(10, avgScore + (Math.random() * 2 - 1));
    const commScore = Math.min(10, avgScore + (Math.random() * 2 - 1));
    const probScore = Math.min(10, avgScore + (Math.random() * 2 - 1));

    let recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire' = 'Hold';
    if (avgScore >= 8.5) recommendation = 'Strong Hire';
    else if (avgScore >= 7.0) recommendation = 'Hire';
    else if (avgScore >= 5.5) recommendation = 'Hold';
    else recommendation = 'No Hire';

    return {
      overallScore: avgScore,
      technicalScore: parseFloat(techScore.toFixed(1)),
      communicationScore: parseFloat(commScore.toFixed(1)),
      problemSolvingScore: parseFloat(probScore.toFixed(1)),
      strengths: [
        'Exceptional command of core system fundamentals.',
        'Logical problem-solving layout.',
        'High-quality explanation of complex concepts.'
      ],
      weaknesses: [
        'Occasionally glosses over low-level runtime optimizations.',
        'Could be more expressive on system boundaries.'
      ],
      suggestions: [
        'Spend more time studying distributed caches and queue architectures.',
        'Practice time-boxing answers to maintain high precision.'
      ],
      recommendation
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const payload = questionsAndAnswers.map(q => ({
      question: q.questionText,
      answer: q.userAnswer || 'No answer provided',
      score: q.feedback?.score || 0
    }));

    const prompt = `
      You are an interview panel evaluating a mock interview for the role "${role}".
      Here are the questions, user answers, and individual scores:
      ${JSON.stringify(payload)}

      Summarize the entire performance and return a valid JSON object matching this TypeScript interface:
      interface IReportResult {
        overallScore: number; // average score out of 10
        technicalScore: number; // technical score out of 10
        communicationScore: number; // communication score out of 10
        problemSolvingScore: number; // problem solving score out of 10
        strengths: string[]; // 3 bullet points
        weaknesses: string[]; // 2-3 bullet points
        suggestions: string[]; // 2-3 action items for study
        recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
      }

      Respond ONLY with the JSON object. Do not include markdown codeblocks (like \`\`\`json).
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSONString(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in Gemini generateFinalReport, using fallback:', error);
    // Return mock fallback
    return {
      overallScore: 7.5,
      technicalScore: 7.8,
      communicationScore: 7.2,
      problemSolvingScore: 7.5,
      strengths: ['Structured thinking', 'Strong vocabulary'],
      weaknesses: ['Needs more hands-on syntax clarity'],
      suggestions: ['Read up on common design patterns', 'Mock up coding interfaces'],
      recommendation: 'Hire'
    };
  }
}

export async function generateRoadmap(weakSkill: string): Promise<IRoadmapResult> {
  if (!genAI) {
    return {
      weakSkill,
      resources: [
        {
          title: `Mastering ${weakSkill} - Guide & Visual Sheets`,
          type: 'article',
          url: 'https://dev.to'
        },
        {
          title: `Understanding ${weakSkill} in Production`,
          type: 'video',
          url: 'https://youtube.com'
        },
        {
          title: `Ultimate Course on ${weakSkill} & Systems Design`,
          type: 'course',
          url: 'https://udemy.com'
        }
      ]
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Create a targeted micro-learning roadmap for a candidate who is weak in: "${weakSkill}".
      Generate a list of 3 resources. Include 1 article, 1 video recommendation description, and 1 course type resource.
      
      Return a valid JSON object matching this interface:
      interface IRoadmapResult {
        weakSkill: string;
        resources: {
          title: string;
          type: 'article' | 'video' | 'course';
          url: string; // use standard mock learning domain urls
        }[];
      }

      Respond ONLY with the JSON object. Do not include markdown codeblocks (like \`\`\`json).
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSONString(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in Gemini generateRoadmap, using fallback:', error);
    return {
      weakSkill,
      resources: [
        { title: `Deep Dive into ${weakSkill}`, type: 'article', url: 'https://medium.com' },
        { title: `Learn ${weakSkill} in 10 Minutes`, type: 'video', url: 'https://youtube.com' },
        { title: `${weakSkill} Certification Program`, type: 'course', url: 'https://coursera.org' }
      ]
    };
  }
}

export async function analyzeResume(resumeText: string): Promise<IResumeResult> {
  if (!genAI) {
    // Clean mock response
    return {
      strengthScore: 78,
      skillsMatched: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Git', 'REST APIs'],
      missingSkills: ['Docker', 'CI/CD Pipelines', 'AWS Deployment', 'GraphQL'],
      experienceSummary: 'Candidate shows solid frontend foundations with 2 years of React experience. Strong layout patterns, but light on DevOps and testing workflows.',
      suggestions: [
        'Add a containerization project (Docker) to your portfolio.',
        'List units tests (Jest, React Testing Library) explicitly in project descriptions.',
        'Host application deployments on AWS/GCP instead of basic static hosting.'
      ]
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an applicant tracking system and hiring manager.
      Analyze this extracted resume text and evaluate its quality:
      "${resumeText.substring(0, 4000)}"

      Return a valid JSON object matching this interface:
      interface IResumeResult {
        strengthScore: number; // 0 to 100 representing resume completeness & strength
        skillsMatched: string[]; // skills found in resume (list up to 8)
        missingSkills: string[]; // industry-standard skills for a modern developer not seen here (list 3-5)
        experienceSummary: string; // 1-2 sentence summary of core experiences
        suggestions: string[]; // 3 bullet points of specific improvements to resume format or contents
      }

      Respond ONLY with the JSON object. Do not include markdown codeblocks (like \`\`\`json).
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJSONString(result.response.text());
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in Gemini analyzeResume, using fallback:', error);
    return {
      strengthScore: 70,
      skillsMatched: ['Web Development', 'JavaScript', 'HTML/CSS'],
      missingSkills: ['TypeScript', 'Testing (Jest/Cypress)', 'SQL Database Design'],
      experienceSummary: 'Software builder with experience in client-facing applications.',
      suggestions: [
        'Detail quantitative impact of your projects (e.g. reduced load time by 30%).',
        'Add clear section headers for Skills, Education, and Experience.'
      ]
    };
  }
}
