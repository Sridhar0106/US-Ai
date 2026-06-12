# US Ai (Under Surveillance AI) 🤖💼

An enterprise-grade, AI-driven mock interview and recruitment preparation platform. Built with a React + TypeScript frontend and an Express + MongoDB backend, leveraging Google's **Gemini API** to deliver context-aware, real-time feedback, speech-to-text response parsing, resume auditing, and personalized learning roadmaps.

---

## 🌟 Key Features

*   **Real-time AI Mock Interviews:** Custom-tailored technical and behavioral interview simulations. The AI dynamically adapts its questions based on chosen roles (e.g., Frontend, Backend, AI Engineering) and difficulty settings (Easy, Medium, Hard).
*   **Adaptive Follow-Up Engine:** The interviewer listens to candidate answers and generates relevant, deep-dive follow-up questions to test genuine engineering depth rather than simple memorization.
*   **Speech-to-Text Integration:** Powered by the browser's Web Speech API, allowing candidates to speak their answers naturally. Users can also type or review/edit transcripts before submission.
*   **Semantic Resume Analyzer:** Upload any PDF resume to instantly extract skills, calculate score matches for specific roles, detect missing skill-sets, and receive structured rewrite suggestions.
*   **Personalized Roadmap Generator:** If the AI detects weak areas during the mock interview or resume analysis, it constructs a custom learning path complete with recommended articles, video guides, and courses to bridge the gap.
*   **Granular Performance Analytics:** Sleek visual dashboards (built with Recharts) mapping metrics like technical accuracy, communication clarity, and problem-solving velocity, complete with a download-ready PDF report.
*   **Admin Audit Control Panel:** A clean management workspace to monitor applicants, view audit transcripts, track user performance charts, and define custom role templates.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React 19 + TypeScript + Vite (fast HMR and compile speeds)
*   **Styling:** TailwindCSS 4 (modern layout styling with smooth transitions)
*   **Animations:** Framer Motion (premium micro-interactions, modal fade-ins, and page transitions)
*   **Visualizations:** Recharts (responsive analytics charts)
*   **Icons:** Lucide React
*   **Networking:** Axios (with custom interceptors for auth flow)

### Backend & AI
*   **Runtime:** Node.js + Express.js (TypeScript)
*   **Database:** MongoDB + Mongoose (structured candidate profiles, interview logs, and performance metrics)
*   **AI Models:** Google Gemini API (`gemini-1.5-flash` for high-speed, cost-efficient generation and evaluations)
*   **Fallback Layer:** Built-in high-fidelity mock AI fallback services to ensure testing runs smoothly even without API keys configured.
*   **File Parsing:** Multer + PDF-Parse (for secure PDF upload and text-extraction during resume scanning)
*   **Authentication:** JSON Web Tokens (JWT) + BcryptJS password hashing

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (local or Atlas cluster)
*   Google Gemini API Key (optional; fallback mock data will be used if not provided)

### 1. Clone & Setup Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory using `.env.example` as a guide:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27018/ai-hr
   JWT_SECRET=your_jwt_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Spin up the development server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

## 🔒 Security Practices
*   Passwords are salted and hashed using `bcryptjs`.
*   Routes are guarded by JWT middleware checks.
*   Secure file type validation restricts resume uploads strictly to PDFs.
