export type StepStatus = 'completed' | 'in-progress' | 'available' | 'locked';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ResourceItem {
  type: 'course' | 'youtube' | 'docs' | 'practice' | 'project' | 'article';
  title: string;
  url: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  topics: string[];
  duration: string;
  difficulty: Difficulty;
  status: StepStatus;
  progress: number;
  icon: string;
  color: string;
  resources: ResourceItem[];
  aiTip: string;
  interviewQuestions: string[];
}

export interface RoleRoadmap {
  role: string;
  description: string;
  duration: string;
  level: string;
  jobReadyScore: number;
  completionPct: number;
  steps: RoadmapStep[];
}

export interface RoleCategory {
  category: string;
  icon: string;
  roles: string[];
}

export const ytUrl = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' tutorial')}`;

export const ROLE_CATEGORIES: RoleCategory[] = [
  { category: 'Core Track', icon: '⭐', roles: ['Full Stack Developer','Frontend Developer','Backend Developer','Java Developer','Python Developer','Data Analyst','Data Scientist','AI/ML Engineer','DevOps Engineer','Cloud Engineer'] },
  { category: 'Software Development', icon: '💻', roles: ['Software Engineer','Software Developer','Application Developer','Web Developer','Mobile App Developer','Android Developer','iOS Developer','Game Developer','Embedded Systems Engineer','Firmware Engineer','Software Architect','Technical Lead'] },
  { category: 'Testing & QA', icon: '🧪', roles: ['QA Engineer','Software Tester','Automation Test Engineer','Performance Test Engineer','Security Tester','Quality Analyst'] },
  { category: 'Cybersecurity', icon: '🔐', roles: ['Cybersecurity Analyst','Security Engineer','Information Security Analyst','SOC Analyst','Ethical Hacker','Penetration Tester','Security Consultant','Digital Forensics Analyst','Incident Response Analyst'] },
  { category: 'Database & Data', icon: '🗄️', roles: ['Database Administrator (DBA)','Database Developer','Data Engineer','ETL Developer','Data Architect','BI Developer','BI Analyst'] },
  { category: 'Networking & Infra', icon: '🌐', roles: ['Network Engineer','Network Administrator','System Administrator','Infrastructure Engineer','Site Reliability Engineer (SRE)','IT Support Engineer','Technical Support Engineer','Desktop Support Engineer'] },
  { category: 'Cloud & Platform', icon: '☁️', roles: ['Platform Engineer','Cloud Security Engineer','Kubernetes Engineer','Cloud Solutions Architect'] },
  { category: 'ERP & Enterprise', icon: '🏢', roles: ['SAP Consultant','SAP ABAP Developer','Salesforce Developer','Salesforce Administrator','Oracle Consultant','Microsoft Dynamics Consultant'] },
  { category: 'Product & Business', icon: '📋', roles: ['Business Analyst','Product Analyst','Product Manager','Technical Product Manager','Project Manager','Program Manager','Scrum Master'] },
  { category: 'UI/UX & Design', icon: '🎨', roles: ['UI Designer','UX Designer','UI/UX Designer','Product Designer','Interaction Designer'] },
  { category: 'AI & Emerging', icon: '🤖', roles: ['Prompt Engineer','Generative AI Engineer','AI Research Engineer','NLP Engineer','Computer Vision Engineer','Robotics Engineer','MLOps Engineer'] },
  { category: 'Blockchain & Web3', icon: '⛓️', roles: ['Blockchain Developer','Smart Contract Developer','AR/VR Developer','IoT Engineer'] },
  { category: 'Technical Writing', icon: '✍️', roles: ['Technical Writer','Documentation Specialist'] },
  { category: 'IT Operations', icon: '⚙️', roles: ['IT Administrator','IT Manager','IT Consultant','Solutions Architect','Enterprise Architect','Release Manager','Configuration Manager'] },
  { category: 'Freshers Track', icon: '🎓', roles: ['Graduate Engineer Trainee (GET)','Associate Software Engineer','Software Engineer Trainee','Junior Developer','Junior QA Engineer','Technical Support Associate','IT Support Associate','Business Analyst Trainee','Data Engineer Trainee'] },
];

export const ROLES = ROLE_CATEGORIES.flatMap(c => c.roles);

// Predefined static roadmaps for the 10 Core Track roles to preserve their details
const staticRoadmaps: Record<string, RoleRoadmap> = {
  'Full Stack Developer': {
    role: 'Full Stack Developer',
    description: 'A structured study plan to help you go from beginner to job-ready Full Stack Developer.',
    duration: '6–8 Months',
    level: 'Beginner → Advanced',
    jobReadyScore: 72,
    completionPct: 35,
    steps: [
      { id: 1, title: 'HTML Fundamentals', description: 'Learn the building blocks of the web.', topics: ['Semantic Tags', 'Forms', 'Accessibility', 'SEO basics'], duration: '1 Week', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '</>', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'HTML Full Course', url: ytUrl('HTML fundamentals') }, { type: 'docs', title: 'MDN HTML Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }], aiTip: 'Strong HTML semantics directly impact ATS resume scans and accessibility compliance — a key interview topic.', interviewQuestions: ['What are semantic HTML tags?', 'Difference between div and span?', 'What is the purpose of the alt attribute?'] },
      { id: 2, title: 'CSS Fundamentals', description: 'Build responsive layouts and beautiful UIs.', topics: ['Flexbox', 'Grid', 'Responsive Design', 'Animations', 'Media Queries'], duration: '1.5 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🎨', color: '#00D4FF', resources: [{ type: 'youtube', title: 'CSS Full Course', url: ytUrl('CSS Flexbox Grid') }, { type: 'practice', title: 'CSS Battle', url: 'https://cssbattle.dev' }], aiTip: 'Flexbox and Grid are the most commonly tested CSS topics in frontend interviews.', interviewQuestions: ['Flexbox vs CSS Grid?', 'What is the box model?', 'How does z-index work?'] },
      { id: 3, title: 'JavaScript Essentials', description: 'Master the language of the web.', topics: ['Variables', 'Functions', 'DOM', 'ES6+', 'Async/Await', 'Events'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 60, icon: 'JS', color: '#FBBF24', resources: [{ type: 'youtube', title: 'JS Full Course', url: ytUrl('JavaScript ES6 full course') }, { type: 'practice', title: 'JavaScript30', url: 'https://javascript30.com' }], aiTip: 'Closures, promises, and event loop are the top 3 most asked JS interview questions at FAANG companies.', interviewQuestions: ['What is a closure?', 'Explain the event loop.', 'Promise vs async/await?'] },
      { id: 4, title: 'Git & GitHub', description: 'Version control and collaboration workflows.', topics: ['Repositories', 'Branches', 'Pull Requests', 'Merge Conflicts', 'CI/CD basics'], duration: '3 Days', difficulty: 'Beginner', status: 'available', progress: 0, icon: '🔀', color: '#F97316', resources: [{ type: 'youtube', title: 'Git & GitHub Crash Course', url: ytUrl('Git GitHub tutorial') }, { type: 'docs', title: 'Git Documentation', url: 'https://git-scm.com/doc' }], aiTip: 'Every technical interview includes a Git scenario question. Practice merge conflict resolution.', interviewQuestions: ['Git rebase vs merge?', 'How to revert a commit?', 'What is a pull request?'] },
      { id: 5, title: 'React.js', description: 'Build dynamic, component-based UIs.', topics: ['Components', 'Hooks', 'State Management', 'React Router', 'Context API'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '⚛️', color: '#22D3EE', resources: [{ type: 'youtube', title: 'React Full Course', url: ytUrl('React.js full course') }, { type: 'docs', title: 'React Official Docs', url: 'https://react.dev' }], aiTip: 'useEffect and useState hooks, virtual DOM, and component lifecycle are must-know React interview topics.', interviewQuestions: ['What is reconciliation?', 'useEffect vs useLayoutEffect?', 'How to optimize re-renders?'] },
      { id: 6, title: 'Backend Development', description: 'Build REST APIs and server-side applications.', topics: ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Middleware'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '⚙️', color: '#22C55E', resources: [{ type: 'youtube', title: 'Node.js Full Course', url: ytUrl('Node.js Express full course') }, { type: 'docs', title: 'Express Docs', url: 'https://expressjs.com' }], aiTip: 'Understanding the request-response cycle and middleware patterns is critical for backend roles.', interviewQuestions: ['What is middleware?', 'REST vs GraphQL?', 'How to handle async errors in Express?'] },
      { id: 7, title: 'Database Design', description: 'Learn data modeling and query optimization.', topics: ['MongoDB', 'MySQL', 'CRUD Operations', 'Schema Design', 'Indexing'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '🗄️', color: '#F59E0B', resources: [{ type: 'youtube', title: 'MongoDB Crash Course', url: ytUrl('MongoDB tutorial') }, { type: 'practice', title: 'SQLZoo', url: 'https://sqlzoo.net' }], aiTip: 'SQL joins and MongoDB aggregation pipelines are the most common DB interview questions.', interviewQuestions: ['SQL vs NoSQL?', 'What are database indexes?', 'Explain ACID properties.'] },
      { id: 8, title: 'Auth & Security', description: 'Implement secure authentication and data protection.', topics: ['JWT', 'OAuth 2.0', 'Bcrypt', 'Role Management', 'HTTPS'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🔐', color: '#EF4444', resources: [{ type: 'youtube', title: 'JWT Authentication', url: ytUrl('JWT authentication tutorial') }, { type: 'docs', title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten' }], aiTip: 'Security questions are asked in senior interviews. Know the OWASP top 10 vulnerabilities.', interviewQuestions: ['JWT vs Session?', 'What is CSRF?', 'How does OAuth 2.0 work?'] },
      { id: 9, title: 'DevOps & Deployment', description: 'Ship and monitor production applications.', topics: ['Docker', 'CI/CD', 'Cloud Hosting', 'GitHub Actions', 'Monitoring'], duration: '3 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🚀', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'Docker Full Course', url: ytUrl('Docker DevOps tutorial') }, { type: 'docs', title: 'Docker Docs', url: 'https://docs.docker.com' }], aiTip: 'Docker containerization is now expected at all mid-senior level full stack roles.', interviewQuestions: ['Container vs VM?', 'What is CI/CD?', 'How to scale a Node.js app?'] },
      { id: 10, title: 'Capstone Project', description: 'Build a portfolio-ready real-world application.', topics: ['System Design', 'GitHub Portfolio', 'Deployment', 'Documentation', 'Code Review'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'Project Ideas', url: ytUrl('full stack project ideas') }, { type: 'article', title: 'Portfolio Guide', url: 'https://dev.to' }], aiTip: 'A live deployed project is the single most impactful thing you can add to your resume.', interviewQuestions: ['Walk me through your project.', 'What would you improve?', 'How did you handle scaling?'] },
    ]
  },
  'Frontend Developer': {
    role: 'Frontend Developer',
    description: 'Master UI/UX development, modern frameworks, and browser performance for a frontend role.',
    duration: '4–6 Months',
    level: 'Beginner → Advanced',
    jobReadyScore: 68,
    completionPct: 20,
    steps: [
      { id: 1, title: 'HTML & Semantics', description: 'Write accessible, SEO-friendly HTML.', topics: ['Semantic Tags', 'Forms', 'ARIA Roles', 'Meta Tags', 'HTML5 APIs'], duration: '1 Week', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '</>', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'HTML5 Full Course', url: ytUrl('HTML5 semantics full course') }, { type: 'docs', title: 'MDN HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }], aiTip: 'Semantic HTML directly improves SEO and accessibility — both major frontend interview topics.', interviewQuestions: ['Why use semantic HTML?', 'What is ARIA?', 'Difference between HTML4 and HTML5?'] },
      { id: 2, title: 'Advanced CSS', description: 'Create stunning, responsive layouts.', topics: ['Flexbox', 'CSS Grid', 'Animations', 'CSS Variables', 'BEM Methodology'], duration: '2 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🎨', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Advanced CSS', url: ytUrl('Advanced CSS animations flexbox grid') }, { type: 'practice', title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com' }], aiTip: 'CSS animations and transitions are highly valued in frontend UI interviews.', interviewQuestions: ['Flexbox vs Grid?', 'What is BEM?', 'How do CSS custom properties work?'] },
      { id: 3, title: 'JavaScript & DOM', description: 'Build interactive UIs with vanilla JS.', topics: ['DOM Manipulation', 'Events', 'Fetch API', 'ES6+', 'Modules', 'Closures'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 50, icon: 'JS', color: '#FBBF24', resources: [{ type: 'youtube', title: 'JavaScript DOM', url: ytUrl('JavaScript DOM manipulation') }, { type: 'practice', title: 'JS30', url: 'https://javascript30.com' }], aiTip: 'DOM event delegation and async patterns are tested in nearly every frontend interview.', interviewQuestions: ['What is event delegation?', 'How does the event loop work?', 'Explain hoisting.'] },
      { id: 4, title: 'TypeScript', description: 'Add type safety to your JavaScript code.', topics: ['Types & Interfaces', 'Generics', 'Enums', 'Utility Types', 'tsconfig'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: 'TS', color: '#3B82F6', resources: [{ type: 'youtube', title: 'TypeScript Full Course', url: ytUrl('TypeScript full course') }, { type: 'docs', title: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs' }], aiTip: 'TypeScript is now expected in most senior frontend roles. Generics are a common interview topic.', interviewQuestions: ['Type vs Interface?', 'What are generics?', 'How to type React props?'] },
      { id: 5, title: 'React.js Deep Dive', description: 'Master the most in-demand frontend framework.', topics: ['Hooks', 'Context', 'Performance', 'React Query', 'Lazy Loading'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '⚛️', color: '#22D3EE', resources: [{ type: 'youtube', title: 'React Advanced', url: ytUrl('React.js advanced hooks') }, { type: 'docs', title: 'React.dev', url: 'https://react.dev' }], aiTip: 'useMemo, useCallback, and React.memo are the most asked React performance questions.', interviewQuestions: ['How to optimize React performance?', 'What is prop drilling?', 'Explain the reconciliation algorithm.'] },
      { id: 6, title: 'State Management', description: 'Manage complex application state effectively.', topics: ['Redux Toolkit', 'Zustand', 'Recoil', 'Context API', 'React Query'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '🔄', color: '#A855F7', resources: [{ type: 'youtube', title: 'Redux Toolkit', url: ytUrl('Redux Toolkit tutorial') }, { type: 'docs', title: 'Redux Docs', url: 'https://redux-toolkit.js.org' }], aiTip: 'State management architecture questions are common in mid-senior frontend interviews.', interviewQuestions: ['Redux vs Context?', 'When to use Zustand?', 'What is normalized state?'] },
      { id: 7, title: 'Build Tools & Performance', description: 'Optimize your frontend build pipeline.', topics: ['Vite', 'Webpack', 'Lighthouse', 'Code Splitting', 'Lazy Loading'], duration: '1.5 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '⚡', color: '#F59E0B', resources: [{ type: 'youtube', title: 'Vite & Webpack', url: ytUrl('Vite Webpack bundler tutorial') }, { type: 'docs', title: 'Vite Docs', url: 'https://vitejs.dev' }], aiTip: 'Core Web Vitals and Lighthouse score optimization are now part of senior frontend job descriptions.', interviewQuestions: ['What is code splitting?', 'How to improve Lighthouse score?', 'Tree shaking?'] },
      { id: 8, title: 'Testing Frontend Apps', description: 'Write unit, integration, and E2E tests.', topics: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Mocking'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🧪', color: '#10B981', resources: [{ type: 'youtube', title: 'React Testing Library', url: ytUrl('React Testing Library tutorial') }, { type: 'docs', title: 'Testing Library Docs', url: 'https://testing-library.com' }], aiTip: 'Testing is heavily evaluated in senior interviews. Focus on integration tests over unit tests.', interviewQuestions: ['Unit vs E2E testing?', 'How to test async components?', 'What is mocking?'] },
      { id: 9, title: 'Portfolio & Projects', description: 'Build projects that stand out to recruiters.', topics: ['Portfolio Website', 'GitHub Profile', 'Open Source', 'Deployment', 'README Writing'], duration: '3 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'Frontend Project Ideas', url: ytUrl('frontend project ideas for portfolio') }, { type: 'article', title: 'Dev.to', url: 'https://dev.to' }], aiTip: 'A polished portfolio with 3 live projects is worth more than a certification in frontend hiring.', interviewQuestions: ['Walk me through your best project.', 'How did you ensure responsiveness?', 'What would you do differently?'] },
    ]
  },
  'Backend Developer': {
    role: 'Backend Developer',
    description: 'Build scalable server-side applications, APIs, and database systems.',
    duration: '5–7 Months',
    level: 'Beginner → Advanced',
    jobReadyScore: 65,
    completionPct: 25,
    steps: [
      { id: 1, title: 'Programming Fundamentals', description: 'Solid foundation in backend programming.', topics: ['Data Structures', 'Algorithms', 'OOP', 'Complexity Analysis', 'Recursion'], duration: '4 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '💻', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'DSA Full Course', url: ytUrl('data structures algorithms full course') }, { type: 'practice', title: 'LeetCode', url: 'https://leetcode.com' }], aiTip: 'DSA is the backbone of backend interviews at top companies. Start with arrays, strings, and hashmaps.', interviewQuestions: ['What is Big O notation?', 'Array vs Linked List?', 'Explain recursion.'] },
      { id: 2, title: 'Node.js & Express', description: 'Build REST APIs with Node.js ecosystem.', topics: ['Event Loop', 'Express.js', 'Middleware', 'File System', 'Streams'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 40, icon: '⚙️', color: '#22C55E', resources: [{ type: 'youtube', title: 'Node.js Express Course', url: ytUrl('Node.js Express REST API') }, { type: 'docs', title: 'Node.js Docs', url: 'https://nodejs.org/docs' }], aiTip: 'The event loop, callback hell, and streams are the top Node.js interview topics.', interviewQuestions: ['How does the Node.js event loop work?', 'What are streams?', 'Explain middleware chaining.'] },
      { id: 3, title: 'Database Systems', description: 'Design and query relational and NoSQL databases.', topics: ['PostgreSQL', 'MongoDB', 'Schema Design', 'Indexing', 'Transactions'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '🗄️', color: '#F59E0B', resources: [{ type: 'youtube', title: 'SQL & PostgreSQL', url: ytUrl('PostgreSQL full course') }, { type: 'practice', title: 'SQLZoo', url: 'https://sqlzoo.net' }], aiTip: 'Query optimization, joins, and indexing strategies are critical for backend SQL interviews.', interviewQuestions: ['SQL vs NoSQL?', 'What is database normalization?', 'Explain ACID properties.'] },
      { id: 4, title: 'API Design & REST', description: 'Design clean, scalable REST APIs.', topics: ['RESTful Principles', 'HTTP Methods', 'Status Codes', 'Versioning', 'Documentation'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '🔗', color: '#00D4FF', resources: [{ type: 'youtube', title: 'REST API Design', url: ytUrl('REST API design best practices') }, { type: 'docs', title: 'Swagger/OpenAPI', url: 'https://swagger.io/docs' }], aiTip: 'REST API design principles and idempotency are frequently asked in backend interviews.', interviewQuestions: ['REST vs GraphQL?', 'What are idempotent methods?', 'How to version APIs?'] },
      { id: 5, title: 'Authentication & Security', description: 'Secure APIs and user data.', topics: ['JWT', 'OAuth 2.0', 'Rate Limiting', 'Input Validation', 'SQL Injection'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🔐', color: '#EF4444', resources: [{ type: 'youtube', title: 'Backend Security', url: ytUrl('backend API security JWT OAuth') }, { type: 'docs', title: 'OWASP', url: 'https://owasp.org' }], aiTip: 'Know the OWASP top 10 — security vulnerabilities are heavily tested in senior backend interviews.', interviewQuestions: ['How does JWT work?', 'What is CSRF?', 'How to prevent SQL injection?'] },
      { id: 6, title: 'Caching & Performance', description: 'Optimize application performance at scale.', topics: ['Redis', 'Caching Strategies', 'CDN', 'Load Balancing', 'Query Optimization'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '⚡', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'Redis Caching', url: ytUrl('Redis caching tutorial') }, { type: 'docs', title: 'Redis Docs', url: 'https://redis.io/docs' }], aiTip: 'Redis and caching strategies are asked in almost every senior backend interview.', interviewQuestions: ['When to use Redis?', 'Cache invalidation strategies?', 'How to handle cache stampede?'] },
      { id: 7, title: 'Message Queues', description: 'Handle async workloads with queuing systems.', topics: ['RabbitMQ', 'Kafka', 'Event-driven Architecture', 'Pub/Sub', 'Dead Letter Queue'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '📨', color: '#F97316', resources: [{ type: 'youtube', title: 'Kafka & RabbitMQ', url: ytUrl('Kafka RabbitMQ message queue tutorial') }, { type: 'docs', title: 'Kafka Docs', url: 'https://kafka.apache.org/documentation' }], aiTip: 'Message queues are a senior backend topic — know when to use Kafka vs RabbitMQ.', interviewQuestions: ['Kafka vs RabbitMQ?', 'What is a dead letter queue?', 'Explain event sourcing.'] },
      { id: 8, title: 'System Design', description: 'Design large-scale distributed systems.', topics: ['Microservices', 'API Gateway', 'Load Balancers', 'Horizontal Scaling', 'CAP Theorem'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏗️', color: '#22D3EE', resources: [{ type: 'youtube', title: 'System Design Primer', url: ytUrl('system design interview preparation') }, { type: 'article', title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }], aiTip: 'System design rounds are the most important factor in backend/senior promotions and job offers.', interviewQuestions: ['Design a URL shortener.', 'How to design a chat app?', 'Explain CAP theorem.'] },
      { id: 9, title: 'Capstone API Project', description: 'Build a production-grade backend system.', topics: ['Full REST API', 'Auth', 'Database', 'Caching', 'Deployment'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'Backend Project Ideas', url: ytUrl('backend project ideas portfolio') }, { type: 'article', title: 'Dev.to', url: 'https://dev.to' }], aiTip: 'A deployed backend API with proper auth, caching, and documentation is your strongest portfolio item.', interviewQuestions: ['How did you handle auth?', 'How does your API scale?', 'What monitoring did you add?'] },
    ]
  },
  'Java Developer': {
    role: 'Java Developer',
    description: 'Master Java programming, Spring Boot, and enterprise software development.',
    duration: '5–7 Months',
    level: 'Beginner → Advanced',
    jobReadyScore: 70,
    completionPct: 30,
    steps: [
      { id: 1, title: 'Java Fundamentals', description: 'Build a rock-solid Java foundation.', topics: ['OOP Concepts', 'Collections', 'Generics', 'Exception Handling', 'Java 8+ Features'], duration: '4 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '☕', color: '#F97316', resources: [{ type: 'youtube', title: 'Java Full Course', url: ytUrl('Java programming full course') }, { type: 'docs', title: 'Java Docs', url: 'https://docs.oracle.com/javase' }], aiTip: 'OOP principles and Java Collections are the most frequently tested topics in Java interviews.', interviewQuestions: ['Polymorphism vs Inheritance?', 'HashMap vs TreeMap?', 'What is autoboxing?'] },
      { id: 2, title: 'Java 8+ Features', description: 'Modern Java with lambdas and streams.', topics: ['Lambdas', 'Stream API', 'Optional', 'Functional Interfaces', 'Date/Time API'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'completed', progress: 100, icon: '⚡', color: '#FBBF24', resources: [{ type: 'youtube', title: 'Java 8 Features', url: ytUrl('Java 8 streams lambdas tutorial') }, { type: 'docs', title: 'Java 8 Guide', url: 'https://www.baeldung.com/java-8' }], aiTip: 'Java Stream API and lambda expressions are asked in virtually every Java interview.', interviewQuestions: ['Stream vs Collection?', 'What is a functional interface?', 'map vs flatMap?'] },
      { id: 3, title: 'Data Structures & Algorithms', description: 'Crack coding rounds with DSA mastery.', topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting Algorithms'], duration: '6 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 45, icon: '🧩', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'DSA in Java', url: ytUrl('data structures algorithms Java') }, { type: 'practice', title: 'LeetCode', url: 'https://leetcode.com' }], aiTip: 'DSA on LeetCode with Java is the single best way to prepare for coding rounds at product companies.', interviewQuestions: ['Reverse a linked list?', 'Binary search implementation?', 'BFS vs DFS?'] },
      { id: 4, title: 'Spring Boot Basics', description: 'Build enterprise REST APIs with Spring Boot.', topics: ['IoC Container', 'Dependency Injection', 'REST Controllers', 'Spring Data JPA', 'Annotations'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '🌱', color: '#22C55E', resources: [{ type: 'youtube', title: 'Spring Boot Course', url: ytUrl('Spring Boot full course') }, { type: 'docs', title: 'Spring Docs', url: 'https://spring.io/docs' }], aiTip: 'Spring Boot dependency injection and auto-configuration are core Java backend interview topics.', interviewQuestions: ['What is IoC?', 'Spring vs Spring Boot?', 'How does @Autowired work?'] },
      { id: 5, title: 'Hibernate & JPA', description: 'ORM for database interactions in Java.', topics: ['Entity Mapping', 'JPQL', 'Lazy vs Eager Loading', 'Transactions', 'Caching'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '🗄️', color: '#F59E0B', resources: [{ type: 'youtube', title: 'Hibernate & JPA', url: ytUrl('Hibernate JPA tutorial Java') }, { type: 'docs', title: 'Hibernate Docs', url: 'https://hibernate.org/orm/documentation' }], aiTip: 'Hibernate N+1 query problem and lazy vs eager loading are classic Java senior interview questions.', interviewQuestions: ['What is the N+1 problem?', 'Lazy vs Eager loading?', 'How does @Transactional work?'] },
      { id: 6, title: 'Microservices with Spring', description: 'Build cloud-native microservices.', topics: ['Spring Cloud', 'API Gateway', 'Service Discovery', 'Feign Client', 'Circuit Breaker'], duration: '4 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🏗️', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Spring Microservices', url: ytUrl('Spring Boot microservices tutorial') }, { type: 'docs', title: 'Spring Cloud Docs', url: 'https://spring.io/projects/spring-cloud' }], aiTip: 'Microservices architecture and service mesh concepts are tested in senior Java architect interviews.', interviewQuestions: ['Monolith vs Microservices?', 'What is circuit breaking?', 'How does Feign work?'] },
      { id: 7, title: 'Testing in Java', description: 'Write reliable tests for Java applications.', topics: ['JUnit 5', 'Mockito', 'Integration Tests', 'Test Containers', 'Spring Boot Test'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🧪', color: '#10B981', resources: [{ type: 'youtube', title: 'JUnit Mockito', url: ytUrl('JUnit 5 Mockito tutorial') }, { type: 'docs', title: 'JUnit Docs', url: 'https://junit.org/junit5/docs' }], aiTip: 'Testing with JUnit 5 and Mockito is now a standard requirement for Java developer roles.', interviewQuestions: ['Unit vs Integration tests?', 'How to use Mockito?', 'What is @SpringBootTest?'] },
      { id: 8, title: 'Performance & JVM Tuning', description: 'Understand JVM internals and optimize performance.', topics: ['JVM Architecture', 'Garbage Collection', 'Memory Management', 'Profiling', 'JMX'], duration: '2 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '⚙️', color: '#EF4444', resources: [{ type: 'youtube', title: 'JVM Internals', url: ytUrl('JVM internals garbage collection tuning') }, { type: 'docs', title: 'JVM Tuning Guide', url: 'https://www.baeldung.com/jvm-garbage-collectors' }], aiTip: 'JVM garbage collection tuning is a hot topic in senior Java performance interviews.', interviewQuestions: ['How does GC work?', 'What is memory leak?', 'G1 vs CMS collector?'] },
      { id: 9, title: 'Capstone Java Project', description: 'Build a production-ready Spring Boot application.', topics: ['Full REST API', 'Spring Security', 'Docker', 'CI/CD', 'Documentation'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'Java Project Ideas', url: ytUrl('Java Spring Boot project ideas') }, { type: 'article', title: 'Baeldung', url: 'https://www.baeldung.com' }], aiTip: 'A Dockerized Spring Boot app deployed on cloud with CI/CD is the gold standard Java portfolio project.', interviewQuestions: ['How did you handle transactions?', 'How does your app scale?', 'Walk me through your architecture.'] },
    ]
  },
  'Python Developer': {
    role: 'Python Developer',
    description: 'Build web apps, automation, and data pipelines using Python and its ecosystem.',
    duration: '4–6 Months',
    level: 'Beginner → Advanced',
    jobReadyScore: 75,
    completionPct: 40,
    steps: [
      { id: 1, title: 'Python Fundamentals', description: 'Core Python syntax and programming concepts.', topics: ['Variables', 'Data Types', 'Functions', 'OOP', 'Error Handling'], duration: '3 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🐍', color: '#22C55E', resources: [{ type: 'youtube', title: 'Python Full Course', url: ytUrl('Python programming full course') }, { type: 'docs', title: 'Python Docs', url: 'https://docs.python.org/3' }], aiTip: 'Python OOP (dunder methods, decorators, generators) are the most asked Python interview topics.', interviewQuestions: ['List vs Tuple?', 'What is a decorator?', 'How does memory management work in Python?'] },
      { id: 2, title: 'Advanced Python', description: 'Pythonic code and advanced language features.', topics: ['Generators', 'Decorators', 'Context Managers', 'Comprehensions', 'Metaclasses'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'completed', progress: 100, icon: '⚡', color: '#FBBF24', resources: [{ type: 'youtube', title: 'Advanced Python', url: ytUrl('advanced Python features tutorial') }, { type: 'practice', title: 'Exercism', url: 'https://exercism.org/tracks/python' }], aiTip: 'Generator functions and decorators are tested in nearly all senior Python interviews.', interviewQuestions: ['Generator vs Iterator?', 'What is a metaclass?', 'How does @property work?'] },
      { id: 3, title: 'Data Structures & Algorithms', description: 'Solve coding interview problems in Python.', topics: ['Arrays', 'Stacks', 'Queues', 'Trees', 'Dynamic Programming'], duration: '5 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 55, icon: '🧩', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'DSA in Python', url: ytUrl('data structures algorithms Python') }, { type: 'practice', title: 'LeetCode', url: 'https://leetcode.com' }], aiTip: 'Python dict and set comprehensions combined with DSA are essential for whiteboard rounds.', interviewQuestions: ['How to implement a stack?', 'Explain BFS/DFS.', 'What is memoization?'] },
      { id: 4, title: 'Django / FastAPI', description: 'Build REST APIs and web applications.', topics: ['Django ORM', 'FastAPI', 'REST APIs', 'Pydantic', 'Authentication'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '🌐', color: '#10B981', resources: [{ type: 'youtube', title: 'FastAPI Full Course', url: ytUrl('FastAPI Python full course') }, { type: 'docs', title: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com' }], aiTip: 'FastAPI is the fastest-growing Python web framework — it is increasingly asked in Python dev interviews.', interviewQuestions: ['Django vs FastAPI?', 'How does Django ORM work?', 'What is Pydantic?'] },
      { id: 5, title: 'Database & ORM', description: 'Work with databases using SQLAlchemy and PostgreSQL.', topics: ['SQLAlchemy', 'PostgreSQL', 'Migrations', 'Query Optimization', 'Async DB'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '🗄️', color: '#F59E0B', resources: [{ type: 'youtube', title: 'SQLAlchemy Tutorial', url: ytUrl('SQLAlchemy Python tutorial') }, { type: 'docs', title: 'SQLAlchemy Docs', url: 'https://docs.sqlalchemy.org' }], aiTip: 'ORM lazy loading and N+1 queries are common Python backend interview questions.', interviewQuestions: ['SQLAlchemy vs Django ORM?', 'How to avoid N+1 queries?', 'What are Alembic migrations?'] },
      { id: 6, title: 'Testing with Python', description: 'Build a reliable test suite for Python apps.', topics: ['pytest', 'Mocking', 'Fixtures', 'Coverage', 'Integration Tests'], duration: '1.5 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🧪', color: '#EF4444', resources: [{ type: 'youtube', title: 'pytest Tutorial', url: ytUrl('pytest Python testing tutorial') }, { type: 'docs', title: 'pytest Docs', url: 'https://docs.pytest.org' }], aiTip: 'pytest fixtures and mock patching are essential skills for Python developer roles.', interviewQuestions: ['pytest vs unittest?', 'What is a fixture?', 'How to mock external APIs?'] },
      { id: 7, title: 'Async Python', description: 'Write non-blocking, high-performance Python code.', topics: ['asyncio', 'aiohttp', 'Coroutines', 'Event Loop', 'Concurrency'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🔄', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'Python asyncio', url: ytUrl('Python asyncio tutorial') }, { type: 'docs', title: 'asyncio Docs', url: 'https://docs.python.org/3/library/asyncio.html' }], aiTip: 'Async/await patterns are now a must for Python backend developer roles, especially with FastAPI.', interviewQuestions: ['Threading vs asyncio?', 'What is the GIL?', 'async def vs def?'] },
      { id: 8, title: 'Deployment & DevOps', description: 'Ship Python apps to production.', topics: ['Docker', 'GitHub Actions', 'Gunicorn', 'Nginx', 'Cloud Hosting'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🚀', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Deploy Python App', url: ytUrl('Docker Python Django FastAPI deployment') }, { type: 'docs', title: 'Docker Docs', url: 'https://docs.docker.com' }], aiTip: 'Containerizing Python apps with Docker and deploying via CI/CD is expected in senior dev roles.', interviewQuestions: ['How to Dockerize a FastAPI app?', 'Gunicorn vs Uvicorn?', 'How to handle environment variables securely?'] },
      { id: 9, title: 'Capstone Python Project', description: 'Build and deploy a complete Python web application.', topics: ['REST API', 'Auth', 'DB', 'Tests', 'Deployment'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'Python Project Ideas', url: ytUrl('Python project ideas for portfolio') }, { type: 'article', title: 'Real Python', url: 'https://realpython.com' }], aiTip: 'A live FastAPI + PostgreSQL + Docker project proves you are production-ready.', interviewQuestions: ['Walk me through your architecture.', 'How did you handle authentication?', 'What are the trade-offs in your design?'] },
    ]
  },
  'Data Analyst': {
    role: 'Data Analyst',
    description: 'Extract insights from data using SQL, Excel, Python, and BI tools.',
    duration: '3–5 Months',
    level: 'Beginner → Intermediate',
    jobReadyScore: 80,
    completionPct: 45,
    steps: [
      { id: 1, title: 'Excel & Spreadsheets', description: 'Master data manipulation in Excel.', topics: ['VLOOKUP', 'Pivot Tables', 'Power Query', 'Data Validation', 'Charts'], duration: '1 Week', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '📊', color: '#22C55E', resources: [{ type: 'youtube', title: 'Excel for Analysts', url: ytUrl('Excel data analysis pivot tables') }, { type: 'docs', title: 'Excel Support', url: 'https://support.microsoft.com/en-us/excel' }], aiTip: 'Excel pivot tables and VLOOKUP are still the most commonly tested skills in junior data analyst interviews.', interviewQuestions: ['VLOOKUP vs XLOOKUP?', 'What is a pivot table?', 'How to remove duplicates in Excel?'] },
      { id: 2, title: 'SQL Fundamentals', description: 'Query and analyze data with SQL.', topics: ['SELECT', 'JOINs', 'Aggregations', 'Subqueries', 'Window Functions'], duration: '3 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🗄️', color: '#3B82F6', resources: [{ type: 'youtube', title: 'SQL Full Course', url: ytUrl('SQL full course for data analysts') }, { type: 'practice', title: 'Mode Analytics', url: 'https://mode.com/sql-tutorial' }], aiTip: 'Window functions (ROW_NUMBER, RANK, LAG) are the #1 most tested SQL topic for data analyst interviews.', interviewQuestions: ['INNER vs OUTER JOIN?', 'What is a window function?', 'How does GROUP BY work?'] },
      { id: 3, title: 'Python for Data Analysis', description: 'Analyze and visualize data with Python.', topics: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Data Cleaning'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 70, icon: '🐍', color: '#FBBF24', resources: [{ type: 'youtube', title: 'Pandas & NumPy', url: ytUrl('Pandas NumPy data analysis Python') }, { type: 'docs', title: 'Pandas Docs', url: 'https://pandas.pydata.org/docs' }], aiTip: 'Pandas groupby, merge, and pivot_table operations are tested in almost every data analyst take-home task.', interviewQuestions: ['How to handle missing data?', 'groupby vs pivot_table?', 'What is vectorization?'] },
      { id: 4, title: 'Data Visualization', description: 'Tell stories with data using charts and dashboards.', topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '📈', color: '#A855F7', resources: [{ type: 'youtube', title: 'Tableau Full Course', url: ytUrl('Tableau data visualization tutorial') }, { type: 'docs', title: 'Tableau Docs', url: 'https://help.tableau.com' }], aiTip: 'Tableau and Power BI proficiency is expected in most data analyst job descriptions in 2024.', interviewQuestions: ['When to use a bar chart vs line chart?', 'How to create a Tableau dashboard?', 'What is data storytelling?'] },
      { id: 5, title: 'Statistics & Probability', description: 'Understand the math behind data insights.', topics: ['Descriptive Stats', 'Distributions', 'Hypothesis Testing', 'Correlation', 'Regression'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '📐', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Statistics for Data Analysis', url: ytUrl('statistics probability data analysis') }, { type: 'article', title: 'StatQuest', url: 'https://www.youtube.com/@statquest' }], aiTip: 'Hypothesis testing (p-value, t-test) and A/B testing are standard analyst interview topics at tech companies.', interviewQuestions: ['What is a p-value?', 'How does A/B testing work?', 'Correlation vs causation?'] },
      { id: 6, title: 'Advanced SQL', description: 'Write complex analytical queries.', topics: ['CTEs', 'Window Functions', 'Query Optimization', 'Stored Procedures', 'Indexing'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🔍', color: '#F97316', resources: [{ type: 'youtube', title: 'Advanced SQL', url: ytUrl('advanced SQL window functions CTEs') }, { type: 'practice', title: 'HackerRank SQL', url: 'https://www.hackerrank.com/domains/sql' }], aiTip: 'CTEs and recursive queries are the most advanced SQL topics tested in data analyst senior interviews.', interviewQuestions: ['What is a CTE?', 'Recursive SQL query?', 'How to optimize a slow query?'] },
      { id: 7, title: 'BI Tools & Dashboards', description: 'Build interactive business intelligence dashboards.', topics: ['Power BI', 'Tableau', 'DAX', 'KPI Design', 'Data Modeling'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '📊', color: '#10B981', resources: [{ type: 'youtube', title: 'Power BI Full Course', url: ytUrl('Power BI full course tutorial') }, { type: 'docs', title: 'Power BI Docs', url: 'https://docs.microsoft.com/en-us/power-bi' }], aiTip: 'Power BI DAX formulas and data modeling are tested in business analyst and data analyst interviews.', interviewQuestions: ['What is DAX?', 'Star schema vs Snowflake?', 'How to create calculated columns?'] },
      { id: 8, title: 'Capstone Analyst Project', description: 'End-to-end data analysis and dashboard project.', topics: ['Data Collection', 'Cleaning', 'EDA', 'Visualization', 'Insights Report'], duration: '3 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'Analyst Project Ideas', url: ytUrl('data analyst portfolio project ideas') }, { type: 'article', title: 'Kaggle', url: 'https://kaggle.com' }], aiTip: 'A public Kaggle project or a Tableau Public dashboard is the gold standard data analyst portfolio item.', interviewQuestions: ['Walk me through your analysis process.', 'How did you validate your insights?', 'What tools did you use?'] },
    ]
  },
  'Data Scientist': {
    role: 'Data Scientist',
    description: 'Build predictive models, run experiments, and extract business value from data.',
    duration: '6–9 Months',
    level: 'Intermediate → Expert',
    jobReadyScore: 62,
    completionPct: 20,
    steps: [
      { id: 1, title: 'Python & Statistics', description: 'Python programming and statistical foundations.', topics: ['Python OOP', 'Pandas', 'NumPy', 'Probability', 'Statistical Tests'], duration: '4 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🐍', color: '#22C55E', resources: [{ type: 'youtube', title: 'Python for Data Science', url: ytUrl('Python data science full course') }, { type: 'docs', title: 'Pandas Docs', url: 'https://pandas.pydata.org' }], aiTip: 'Statistical foundations (p-value, confidence intervals, distributions) are tested heavily in DS interviews.', interviewQuestions: ['Central Limit Theorem?', 'Type I vs Type II error?', 'What is a confidence interval?'] },
      { id: 2, title: 'Exploratory Data Analysis', description: 'Discover patterns and insights in raw data.', topics: ['Univariate Analysis', 'Bivariate Analysis', 'Correlation', 'Outlier Detection', 'Feature Engineering'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 60, icon: '🔍', color: '#FBBF24', resources: [{ type: 'youtube', title: 'EDA Python', url: ytUrl('exploratory data analysis Python pandas') }, { type: 'practice', title: 'Kaggle EDA', url: 'https://kaggle.com' }], aiTip: 'EDA and feature engineering are the most impactful skills for Kaggle competitions and DS interviews.', interviewQuestions: ['How to handle outliers?', 'What is feature engineering?', 'When to use a log transform?'] },
      { id: 3, title: 'Machine Learning Fundamentals', description: 'Core supervised and unsupervised ML algorithms.', topics: ['Linear/Logistic Regression', 'Decision Trees', 'Random Forest', 'KMeans', 'SVM'], duration: '5 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '🤖', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'ML Full Course', url: ytUrl('machine learning full course scikit-learn') }, { type: 'docs', title: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/documentation.html' }], aiTip: 'Bias-variance tradeoff, overfitting, and cross-validation are the most fundamental ML interview questions.', interviewQuestions: ['Bias vs Variance?', 'Random Forest vs Gradient Boosting?', 'What is cross-validation?'] },
      { id: 4, title: 'Advanced ML Techniques', description: 'Ensemble methods, boosting, and model tuning.', topics: ['XGBoost', 'LightGBM', 'Hyperparameter Tuning', 'Stacking', 'Feature Selection'], duration: '3 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '⚡', color: '#F97316', resources: [{ type: 'youtube', title: 'XGBoost LightGBM', url: ytUrl('XGBoost LightGBM tutorial') }, { type: 'docs', title: 'XGBoost Docs', url: 'https://xgboost.readthedocs.io' }], aiTip: 'XGBoost hyperparameter tuning is the go-to technique for winning Kaggle competitions and impressing in DS interviews.', interviewQuestions: ['XGBoost vs LightGBM?', 'What is SHAP?', 'How to tune hyperparameters?'] },
      { id: 5, title: 'Deep Learning Basics', description: 'Introduction to neural networks and PyTorch.', topics: ['Neural Networks', 'Backpropagation', 'PyTorch', 'CNNs', 'RNNs'], duration: '4 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🧠', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'PyTorch Deep Learning', url: ytUrl('PyTorch deep learning tutorial') }, { type: 'docs', title: 'PyTorch Docs', url: 'https://pytorch.org/docs' }], aiTip: 'Deep learning fundamentals are increasingly expected even for non-NLP data scientist roles.', interviewQuestions: ['Explain backpropagation.', 'CNN vs RNN?', 'What is the vanishing gradient problem?'] },
      { id: 6, title: 'SQL & Data Engineering', description: 'Work with data pipelines and warehouses.', topics: ['SQL', 'Spark', 'ETL Pipelines', 'Data Warehousing', 'dbt'], duration: '3 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🗄️', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Apache Spark Tutorial', url: ytUrl('Apache Spark Python tutorial') }, { type: 'docs', title: 'Spark Docs', url: 'https://spark.apache.org/docs' }], aiTip: 'SQL window functions and ETL pipeline design are commonly asked in FAANG DS interviews.', interviewQuestions: ['How does Spark work?', 'OLAP vs OLTP?', 'How to design an ETL pipeline?'] },
      { id: 7, title: 'ML Model Deployment', description: 'Deploy and monitor ML models in production.', topics: ['Flask/FastAPI', 'Model Serialization', 'Docker', 'MLflow', 'Feature Stores'], duration: '3 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🚀', color: '#10B981', resources: [{ type: 'youtube', title: 'ML Deployment', url: ytUrl('machine learning model deployment FastAPI Docker') }, { type: 'docs', title: 'MLflow Docs', url: 'https://mlflow.org/docs/latest/index.html' }], aiTip: 'Production ML deployment and model monitoring knowledge sets senior data scientists apart.', interviewQuestions: ['How to serve a model in production?', 'What is model drift?', 'How to monitor predictions?'] },
      { id: 8, title: 'Capstone DS Project', description: 'End-to-end data science pipeline and model.', topics: ['Problem Definition', 'EDA', 'Modeling', 'Evaluation', 'Deployment'], duration: '5 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'DS Project Ideas', url: ytUrl('data science portfolio project ideas') }, { type: 'practice', title: 'Kaggle', url: 'https://kaggle.com' }], aiTip: 'A public Kaggle project or a Tableau Public dashboard is the gold standard data scientist portfolio item.', interviewQuestions: ['How did you select your model?', 'How did you evaluate performance?', 'What would you improve?'] },
    ]
  },
  'AI/ML Engineer': {
    role: 'AI/ML Engineer',
    description: 'Design, train, and deploy large-scale AI and machine learning systems.',
    duration: '8–12 Months',
    level: 'Intermediate → Expert',
    jobReadyScore: 55,
    completionPct: 15,
    steps: [
      { id: 1, title: 'Math for ML', description: 'Build the mathematical foundations of AI/ML.', topics: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics', 'Optimization'], duration: '4 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '📐', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'Math for ML', url: ytUrl('mathematics for machine learning') }, { type: 'article', title: '3Blue1Brown', url: 'https://www.3blue1brown.com' }], aiTip: 'Matrix multiplication, chain rule, and Bayes theorem are the mathematical concepts most frequently asked in ML interviews.', interviewQuestions: ['Explain the chain rule.', 'What is eigenvalue?', 'Bayes theorem in practice?'] },
      { id: 2, title: 'Python & ML Libraries', description: 'Python for scientific computing and ML.', topics: ['NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Jupyter'], duration: '3 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🐍', color: '#22C55E', resources: [{ type: 'youtube', title: 'Scikit-learn Tutorial', url: ytUrl('scikit-learn machine learning Python') }, { type: 'docs', title: 'Scikit-learn', url: 'https://scikit-learn.org' }], aiTip: 'Scikit-learn pipelines and cross-validation are widely used in take-home ML assessments.', interviewQuestions: ['Scikit-learn Pipeline?', 'What is StandardScaler?', 'How to do GridSearchCV?'] },
      { id: 3, title: 'Deep Learning & PyTorch', description: 'Build and train neural networks from scratch.', topics: ['Neural Networks', 'Backpropagation', 'PyTorch', 'Activation Functions', 'Optimizers'], duration: '6 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 30, icon: '🧠', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'PyTorch Deep Learning', url: ytUrl('PyTorch deep learning full course') }, { type: 'docs', title: 'PyTorch Docs', url: 'https://pytorch.org/docs' }], aiTip: 'PyTorch autograd, custom training loops, and loss functions are expected knowledge for ML engineer roles.', interviewQuestions: ['How does autograd work?', 'Adam vs SGD?', 'What is batch normalization?'] },
      { id: 4, title: 'Computer Vision', description: 'Build image recognition and detection models.', topics: ['CNNs', 'Transfer Learning', 'YOLO', 'Image Segmentation', 'OpenCV'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '👁️', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Computer Vision PyTorch', url: ytUrl('computer vision PyTorch tutorial') }, { type: 'docs', title: 'OpenCV Docs', url: 'https://docs.opencv.org' }], aiTip: 'Transfer learning with pre-trained CNN models is now the standard approach for most vision tasks.', interviewQuestions: ['What is transfer learning?', 'CNN vs ViT?', 'How does YOLO work?'] },
      { id: 5, title: 'NLP & Transformers', description: 'Build language models and text processing systems.', topics: ['Transformers', 'BERT', 'GPT', 'Hugging Face', 'Text Classification'], duration: '5 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '💬', color: '#FBBF24', resources: [{ type: 'youtube', title: 'Hugging Face NLP', url: ytUrl('Hugging Face transformers NLP tutorial') }, { type: 'docs', title: 'Hugging Face Docs', url: 'https://huggingface.co/docs' }], aiTip: 'The attention mechanism and transformer architecture are the most important NLP interview topics in 2024.', interviewQuestions: ['Explain the attention mechanism.', 'BERT vs GPT?', 'What is fine-tuning?'] },
      { id: 6, title: 'MLOps & Model Deployment', description: 'Build production ML pipelines and CI/CD.', topics: ['MLflow', 'Kubeflow', 'Docker', 'Model Monitoring', 'Feature Stores'], duration: '4 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🚀', color: '#F97316', resources: [{ type: 'youtube', title: 'MLOps Tutorial', url: ytUrl('MLOps tutorial production machine learning') }, { type: 'docs', title: 'MLflow Docs', url: 'https://mlflow.org' }], aiTip: 'MLOps is a top skill gap for junior ML engineers — it directly impacts your salary level.', interviewQuestions: ['What is model drift?', 'How to version ML models?', 'What is a feature store?'] },
      { id: 7, title: 'Large Language Models', description: 'Work with LLMs, RAG, and prompt engineering.', topics: ['LangChain', 'RAG', 'Vector Databases', 'Prompt Engineering', 'Fine-tuning LLMs'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🤖', color: '#EC4899', resources: [{ type: 'youtube', title: 'LangChain RAG Tutorial', url: ytUrl('LangChain RAG vector database tutorial') }, { type: 'docs', title: 'LangChain Docs', url: 'https://docs.langchain.com' }], aiTip: 'RAG architecture and LLM fine-tuning are the hottest skills in AI/ML job market of 2024–2025.', interviewQuestions: ['How does RAG work?', 'When to fine-tune vs prompt engineer?', 'What is a vector database?'] },
      { id: 8, title: 'AI System Design', description: 'Architect scalable and reliable AI systems.', topics: ['ML System Design', 'Data Pipelines', 'Serving Infrastructure', 'Evaluation Frameworks', 'A/B Testing'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏗️', color: '#10B981', resources: [{ type: 'youtube', title: 'ML System Design', url: ytUrl('ML system design interview') }, { type: 'article', title: 'ML System Design Blog', url: 'https://huyenchip.com/blog' }], aiTip: 'ML system design interviews are used by FAANG to filter senior ML engineers from juniors.', interviewQuestions: ['Design a recommendation system.', 'How to handle data skew?', 'How to evaluate a ranking model?'] },
      { id: 9, title: 'Capstone AI/ML Project', description: 'Build and deploy a full AI application.', topics: ['LLM Application', 'Model Training', 'API', 'Deployment', 'Monitoring'], duration: '5 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EF4444', resources: [{ type: 'project', title: 'AI Project Ideas', url: ytUrl('AI ML project ideas 2024') }, { type: 'article', title: 'Papers With Code', url: 'https://paperswithcode.com' }], aiTip: 'A deployed LLM-powered application is the top portfolio item for AI/ML engineer job applications.', interviewQuestions: ['Explain your model training pipeline.', 'How do you evaluate your model?', 'How does your system scale?'] },
    ]
  },
  'DevOps Engineer': {
    role: 'DevOps Engineer',
    description: 'Automate infrastructure, build CI/CD pipelines, and manage cloud-native systems.',
    duration: '5–7 Months',
    level: 'Intermediate → Expert',
    jobReadyScore: 60,
    completionPct: 25,
    steps: [
      { id: 1, title: 'Linux & Scripting', description: 'Master the Linux command line and shell scripting.', topics: ['Linux Commands', 'Bash Scripting', 'File Permissions', 'Cron Jobs', 'Process Management'], duration: '2 Weeks', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🐧', color: '#F97316', resources: [{ type: 'youtube', title: 'Linux Full Course', url: ytUrl('Linux command line full course') }, { type: 'docs', title: 'Linux Man Pages', url: 'https://linux.die.net/man' }], aiTip: 'Linux file permissions and bash scripting are tested in every DevOps engineer screening round.', interviewQuestions: ['chmod 755 explained?', 'How to find large files?', 'What is a cron job?'] },
      { id: 2, title: 'Git & Version Control', description: 'Advanced Git workflows for DevOps.', topics: ['Branching Strategies', 'Git Hooks', 'Monorepos', 'GitOps', 'Semantic Versioning'], duration: '1 Week', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '🔀', color: '#22C55E', resources: [{ type: 'youtube', title: 'Git DevOps', url: ytUrl('Git advanced DevOps workflows') }, { type: 'docs', title: 'Git Docs', url: 'https://git-scm.com/doc' }], aiTip: 'GitOps and trunk-based development are the most modern Git practices asked in DevOps interviews.', interviewQuestions: ['Git rebase vs merge?', 'What is GitOps?', 'Feature flags vs branching?'] },
      { id: 3, title: 'Docker & Containers', description: 'Build, ship, and run containerized applications.', topics: ['Dockerfile', 'Docker Compose', 'Networking', 'Volumes', 'Multi-stage Builds'], duration: '3 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 50, icon: '🐳', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Docker Full Course', url: ytUrl('Docker full course containers') }, { type: 'docs', title: 'Docker Docs', url: 'https://docs.docker.com' }], aiTip: 'Docker multi-stage builds and layer caching are performance optimization topics in senior DevOps interviews.', interviewQuestions: ['Container vs VM?', 'How to reduce Docker image size?', 'What is a Docker volume?'] },
      { id: 4, title: 'Kubernetes', description: 'Orchestrate containers at scale with Kubernetes.', topics: ['Pods', 'Deployments', 'Services', 'ConfigMaps', 'HPA & VPA'], duration: '5 Weeks', difficulty: 'Advanced', status: 'available', progress: 0, icon: '☸️', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'Kubernetes Full Course', url: ytUrl('Kubernetes full course tutorial') }, { type: 'docs', title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs' }], aiTip: 'Kubernetes probes, resource limits, and HPA are the most commonly asked K8s interview questions.', interviewQuestions: ['Pod vs Deployment?', 'How does HPA work?', 'What is a namespace?'] },
      { id: 5, title: 'CI/CD Pipelines', description: 'Automate build, test, and deployment pipelines.', topics: ['GitHub Actions', 'Jenkins', 'ArgoCD', 'Pipeline as Code', 'Artifact Management'], duration: '3 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🔁', color: '#10B981', resources: [{ type: 'youtube', title: 'CI/CD Pipeline Tutorial', url: ytUrl('CI CD pipeline GitHub Actions Jenkins') }, { type: 'docs', title: 'GitHub Actions Docs', url: 'https://github.com/actions' }], aiTip: 'GitHub Actions pipeline optimization and ArgoCD GitOps are the most in-demand CI/CD skills.', interviewQuestions: ['What is a pipeline trigger?', 'How to roll back a deployment?', 'What is a deployment strategy?'] },
      { id: 6, title: 'Infrastructure as Code', description: 'Provision and manage infrastructure with code.', topics: ['Terraform', 'Ansible', 'Pulumi', 'CloudFormation', 'State Management'], duration: '4 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🏗️', color: '#F59E0B', resources: [{ type: 'youtube', title: 'Terraform Full Course', url: ytUrl('Terraform infrastructure as code tutorial') }, { type: 'docs', title: 'Terraform Docs', url: 'https://developer.hashicorp.com/terraform/docs' }], aiTip: 'Terraform state management and remote backends are critical IaC interview topics.', interviewQuestions: ['Terraform plan vs apply?', 'What is state locking?', 'Terraform vs Ansible?'] },
      { id: 7, title: 'Monitoring & Observability', description: 'Monitor systems and troubleshoot production issues.', topics: ['Prometheus', 'Grafana', 'ELK Stack', 'Alerting', 'Distributed Tracing'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '📊', color: '#EF4444', resources: [{ type: 'youtube', title: 'Prometheus Grafana', url: ytUrl('Prometheus Grafana monitoring tutorial') }, { type: 'docs', title: 'Prometheus Docs', url: 'https://prometheus.io/docs' }], aiTip: 'The three pillars of observability (metrics, logs, traces) are fundamental to senior DevOps interviews.', interviewQuestions: ['Metrics vs Logs vs Traces?', 'How to debug a performance issue?', 'What is SLO/SLA?'] },
      { id: 8, title: 'Security & Compliance', description: 'Implement DevSecOps practices and compliance.', topics: ['SAST/DAST', 'Secrets Management', 'Network Policies', 'Vault', 'CIS Benchmarks'], duration: '2 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🔐', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'DevSecOps Tutorial', url: ytUrl('DevSecOps security tutorial') }, { type: 'docs', title: 'HashiCorp Vault', url: 'https://developer.hashicorp.com/vault/docs' }], aiTip: 'DevSecOps and secrets management with Vault are rapidly becoming expected knowledge in senior DevOps roles.', interviewQuestions: ['How to scan containers for vulnerabilities?', 'What is Vault?', 'How to manage secrets in K8s?'] },
      { id: 9, title: 'Capstone DevOps Project', description: 'Build a complete DevOps pipeline for a real app.', topics: ['Infra Setup', 'CI/CD', 'Containerization', 'Monitoring', 'IaC'], duration: '4 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'project', title: 'DevOps Project Ideas', url: ytUrl('DevOps project ideas portfolio') }, { type: 'article', title: 'DevOps Roadmap', url: 'https://roadmap.sh/devops' }], aiTip: 'A full Kubernetes + Terraform + CI/CD project on GitHub is the definitive DevOps portfolio piece.', interviewQuestions: ['Walk me through your pipeline.', 'How do you handle rollbacks?', 'How does your infrastructure scale?'] },
    ]
  },
  'Cloud Engineer': {
    role: 'Cloud Engineer',
    description: 'Design, build, and manage scalable cloud infrastructure on AWS, Azure, or GCP.',
    duration: '5–8 Months',
    level: 'Intermediate → Expert',
    jobReadyScore: 58,
    completionPct: 20,
    steps: [
      { id: 1, title: 'Cloud Fundamentals', description: 'Understand core cloud concepts and providers.', topics: ['IaaS/PaaS/SaaS', 'Regions & AZs', 'Cloud Pricing', 'Shared Responsibility', 'FinOps'], duration: '1 Week', difficulty: 'Beginner', status: 'completed', progress: 100, icon: '☁️', color: '#00D4FF', resources: [{ type: 'youtube', title: 'Cloud Computing Basics', url: ytUrl('cloud computing fundamentals AWS Azure GCP') }, { type: 'docs', title: 'AWS Getting Started', url: 'https://aws.amazon.com/getting-started' }], aiTip: 'Cloud shared responsibility model and the difference between IaaS, PaaS, SaaS are foundational cloud interview questions.', interviewQuestions: ['IaaS vs PaaS vs SaaS?', 'What is a region vs AZ?', 'How does cloud pricing work?'] },
      { id: 2, title: 'AWS Core Services', description: 'Master the most widely used AWS services.', topics: ['EC2', 'S3', 'VPC', 'IAM', 'RDS', 'Lambda'], duration: '4 Weeks', difficulty: 'Intermediate', status: 'in-progress', progress: 50, icon: '🟠', color: '#F97316', resources: [{ type: 'youtube', title: 'AWS Full Course', url: ytUrl('AWS full course tutorial') }, { type: 'docs', title: 'AWS Docs', url: 'https://aws.amazon.com/documentation' }], aiTip: 'EC2, S3, IAM, and VPC are the four AWS services you will always be quizzed on in any cloud engineer interview.', interviewQuestions: ['EC2 instance types?', 'S3 storage classes?', 'How does IAM work?'] },
      { id: 3, title: 'Networking in Cloud', description: 'Design secure and efficient cloud networks.', topics: ['VPC Design', 'Subnets', 'Route Tables', 'NAT Gateway', 'Security Groups'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'available', progress: 0, icon: '🌐', color: '#6D4AFF', resources: [{ type: 'youtube', title: 'AWS VPC Networking', url: ytUrl('AWS VPC networking tutorial') }, { type: 'docs', title: 'AWS VPC Docs', url: 'https://aws.amazon.com/vpc' }], aiTip: 'VPC design with public/private subnets and security groups is the most common cloud architecture topic in interviews.', interviewQuestions: ['Public vs Private subnet?', 'Security Group vs NACL?', 'How does NAT Gateway work?'] },
      { id: 4, title: 'Cloud Storage & Databases', description: 'Choose and configure the right data services.', topics: ['S3', 'RDS', 'DynamoDB', 'ElastiCache', 'EFS'], duration: '2 Weeks', difficulty: 'Intermediate', status: 'locked', progress: 0, icon: '🗄️', color: '#10B981', resources: [{ type: 'youtube', title: 'AWS Databases', url: ytUrl('AWS RDS DynamoDB database tutorial') }, { type: 'docs', title: 'AWS RDS Docs', url: 'https://aws.amazon.com/rds' }], aiTip: 'Knowing when to pick RDS vs DynamoDB vs ElastiCache is a high-value cloud architecture interview question.', interviewQuestions: ['RDS vs DynamoDB?', 'What is S3 lifecycle policy?', 'How to design for high availability?'] },
      { id: 5, title: 'Serverless & Managed Services', description: 'Build with Lambda, API Gateway, and managed platforms.', topics: ['Lambda', 'API Gateway', 'SQS/SNS', 'Step Functions', 'EventBridge'], duration: '3 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '⚡', color: '#FBBF24', resources: [{ type: 'youtube', title: 'AWS Lambda Serverless', url: ytUrl('AWS Lambda serverless tutorial') }, { type: 'docs', title: 'AWS Lambda Docs', url: 'https://aws.amazon.com/lambda' }], aiTip: 'Serverless Lambda cold start mitigation and SQS vs SNS differences are common advanced cloud interview topics.', interviewQuestions: ['What is a Lambda cold start?', 'SQS vs SNS?', 'When to use Step Functions?'] },
      { id: 6, title: 'Infrastructure as Code', description: 'Automate cloud infrastructure with Terraform or CDK.', topics: ['Terraform', 'AWS CDK', 'CloudFormation', 'State Management', 'Modules'], duration: '3 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🏗️', color: '#8B5CF6', resources: [{ type: 'youtube', title: 'Terraform AWS', url: ytUrl('Terraform AWS infrastructure as code') }, { type: 'docs', title: 'Terraform Docs', url: 'https://developer.hashicorp.com/terraform/docs' }], aiTip: 'Terraform workspaces and remote state management are the IaC topics most discussed in senior cloud interviews.', interviewQuestions: ['Terraform vs CloudFormation?', 'What is remote state?', 'How to manage multiple environments?'] },
      { id: 7, title: 'Cloud Security & IAM', description: 'Secure cloud resources and manage access.', topics: ['IAM Policies', 'KMS', 'GuardDuty', 'Security Hub', 'Compliance'], duration: '2 Weeks', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '🔐', color: '#EF4444', resources: [{ type: 'youtube', title: 'AWS Security', url: ytUrl('AWS security IAM tutorial') }, { type: 'docs', title: 'AWS Security Docs', url: 'https://aws.amazon.com/security' }], aiTip: 'IAM least privilege and KMS key rotation are heavily assessed in cloud security engineer interviews.', interviewQuestions: ['Principle of least privilege?', 'How does KMS work?', 'What is GuardDuty?'] },
      { id: 8, title: 'Cloud Cost Optimization', description: 'Manage and reduce cloud spend effectively.', topics: ['Reserved Instances', 'Spot Instances', 'Cost Explorer', 'Tagging Strategy', 'Right Sizing'], duration: '1 Week', difficulty: 'Advanced', status: 'locked', progress: 0, icon: '💰', color: '#22C55E', resources: [{ type: 'youtube', title: 'AWS Cost Optimization', url: ytUrl('AWS cost optimization tutorial') }, { type: 'docs', title: 'AWS Cost Explorer', url: 'https://aws.amazon.com/aws-cost-management/aws-cost-explorer' }], aiTip: 'FinOps and cost optimization are increasingly measured as KPIs for cloud engineers at scale companies.', interviewQuestions: ['Reserved vs Spot instances?', 'How to reduce cloud costs?', 'What is right-sizing?'] },
      { id: 9, title: 'Cloud Certifications & Capstone', description: 'Get certified and build cloud portfolio projects.', topics: ['AWS SAA-C03', 'Cloud Architecture', 'Multi-Region Setup', 'Well-Architected Framework', 'Portfolio Project'], duration: '6 Weeks', difficulty: 'Expert', status: 'locked', progress: 0, icon: '🏆', color: '#EC4899', resources: [{ type: 'youtube', title: 'AWS Solutions Architect', url: ytUrl('AWS Solutions Architect Associate certification') }, { type: 'docs', title: 'AWS Well-Architected', url: 'https://aws.amazon.com/architecture/well-architected' }], aiTip: 'AWS SAA-C03 certification is the most recognized and fastest ROI credential for cloud engineer job applications.', interviewQuestions: ['Walk me through your cloud architecture.', 'How do you ensure high availability?', 'How would you design for disaster recovery?'] },
    ]
  }
};

// 7-step Roadmap Template configurations for category-based generation
interface StepTemplate {
  title: string;
  description: string;
  topics: string[];
  duration: string;
  difficulty: Difficulty;
  icon: string;
  color: string;
  resources: { type: 'course' | 'youtube' | 'docs' | 'practice' | 'project' | 'article'; title: string; url: string }[];
  aiTip: string;
  interviewQuestions: string[];
}

const templates: Record<string, StepTemplate[]> = {
  'Software Development': [
    {
      title: 'Programming Foundations',
      description: 'Master core programming fundamentals and clean code.',
      topics: ['Variables', 'Control Flow', 'OOP Concepts', 'SOLID Principles', 'Exception Handling'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '💻',
      color: '#6D4AFF',
      resources: [
        { type: 'youtube', title: 'Programming Foundations', url: ytUrl('programming foundations') },
        { type: 'docs', title: 'Refactoring Guru', url: 'https://refactoring.guru' }
      ],
      aiTip: 'Every coding project starts with clean variables and SOLID principles. Focus on writing self-documenting code.',
      interviewQuestions: ['What are SOLID principles?', 'What is OOP and inheritance?', 'How do you handle exceptions?']
    },
    {
      title: 'Data Structures & Algorithms',
      description: 'Solve coding problems with arrays, trees, and logic.',
      topics: ['Arrays & Hashmaps', 'Recursion', 'Trees', 'Searching & Sorting', 'Complexity (Big O)'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '🧩',
      color: '#FBBF24',
      resources: [
        { type: 'youtube', title: 'DSA Full Course', url: ytUrl('data structures algorithms') },
        { type: 'practice', title: 'LeetCode', url: 'https://leetcode.com' }
      ],
      aiTip: 'Whiteboard tests evaluate your line of thinking. Always state the time complexity (Big O) first.',
      interviewQuestions: ['Explain time and space complexity.', 'How does a Hashmap resolve collisions?', 'DFS vs BFS?']
    },
    {
      title: 'Core Language Deep Dive',
      description: 'Deepen knowledge in the main development stack.',
      topics: ['Concurrency & Threading', 'Memory Management', 'Packages & Modules', 'Unit Testing', 'Language Internals'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '⚡',
      color: '#00D4FF',
      resources: [
        { type: 'youtube', title: 'Advanced Language Concepts', url: ytUrl('concurrency memory management') }
      ],
      aiTip: 'Understanding memory allocation (stack vs heap) distinguishes intermediate and senior software engineers.',
      interviewQuestions: ['How is memory managed in your language?', 'What is a deadlock and how to prevent it?', 'Unit tests vs Integration tests?']
    },
    {
      title: 'APIs & Web Technologies',
      description: 'Learn REST API design, networking, and request processing.',
      topics: ['HTTP Protocols', 'RESTful API Standards', 'JSON/XML parsing', 'Authentication (OAuth/JWT)', 'Postman'],
      duration: '2 Weeks',
      difficulty: 'Intermediate',
      icon: '🔗',
      color: '#22C55E',
      resources: [
        { type: 'youtube', title: 'REST API Design', url: ytUrl('REST API design') },
        { type: 'docs', title: 'Postman Docs', url: 'https://learning.postman.com' }
      ],
      aiTip: 'API status codes matter. Always return correct error codes like 400 for bad input, 401 for unauthorized.',
      interviewQuestions: ['What makes an API RESTful?', 'GET vs POST methods?', 'JWT vs Session authentication?']
    },
    {
      title: 'Database & SQL Integration',
      description: 'Work with relational databases and query optimization.',
      topics: ['SQL Queries & JOINS', 'Indexing & Constraints', 'NoSQL Basics', 'Transactions (ACID)', 'ORM Frameworks'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🗄️',
      color: '#F59E0B',
      resources: [
        { type: 'youtube', title: 'SQL & Database Design', url: ytUrl('database SQL ORM') },
        { type: 'practice', title: 'SQLZoo', url: 'https://sqlzoo.net' }
      ],
      aiTip: 'Always index columns that are frequently queried or joined. Beware of over-indexing.',
      interviewQuestions: ['What are ACID properties?', 'Explain Inner Join vs Left Join.', 'What is an ORM and why use it?']
    },
    {
      title: 'DevOps & Git Collaboration',
      description: 'Deploy code securely using modern build tools.',
      topics: ['Git branching strategies', 'Docker containers', 'CI/CD pipelines', 'GitHub Actions', 'Linux Command Line'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🚀',
      color: '#EF4444',
      resources: [
        { type: 'youtube', title: 'Docker & CI/CD', url: ytUrl('Docker CI/CD pipeline') },
        { type: 'docs', title: 'Git Guides', url: 'https://git-scm.com/doc' }
      ],
      aiTip: 'Dockerizing your application makes it easily runnable in any environment. Learn multi-stage builds.',
      interviewQuestions: ['Docker container vs Virtual Machine?', 'Explain your Git branching workflow.', 'What is a CI/CD pipeline?']
    },
    {
      title: 'Capstone Portfolio Project',
      description: 'Build a production-ready system with testing.',
      topics: ['Architecture Planning', 'Integration Tests', 'Cloud Deployment', 'GitHub Documentation', 'Clean Readme'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [
        { type: 'project', title: 'Portfolio Projects', url: ytUrl('portfolio developer projects') }
      ],
      aiTip: 'A live, deployed capstone project with tests and a neat Readme represents a strong candidate portfolio.',
      interviewQuestions: ['Walk me through your project architecture.', 'How did you handle security?', 'What would you scale next?']
    }
  ],
  'Testing & QA': [
    {
      title: 'QA Foundations',
      description: 'Understand the Software Testing Life Cycle (STLC).',
      topics: ['SDLC vs STLC', 'Test Plans & Test Cases', 'Bug Lifecycle', 'Manual Testing', 'Jira'],
      duration: '2 Weeks',
      difficulty: 'Beginner',
      icon: '🧪',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'STLC Basics', url: ytUrl('STLC manual testing') }],
      aiTip: 'Writing clear bug reports with reproducible steps is the most crucial skill in manual testing.',
      interviewQuestions: ['What is the difference between severity and priority?', 'Write a test case for a login page.', 'What is a bug lifecycle?']
    },
    {
      title: 'Test Automation Tools',
      description: 'Learn automation using frameworks like Selenium or Cypress.',
      topics: ['HTML Locators', 'Selenium/Cypress API', 'Assertions', 'Test Suite Execution', 'Page Object Model'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '⚙️',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Selenium Cypress Tutorial', url: ytUrl('automation testing Selenium Cypress') }],
      aiTip: 'Use Page Object Model (POM) to keep your selectors separate from assertions. It makes code reusable.',
      interviewQuestions: ['What is Page Object Model?', 'How do you handle dynamic dropdowns?', 'Implicit vs Explicit wait?']
    },
    {
      title: 'API & Integration Testing',
      description: 'Verify backend API integrity.',
      topics: ['HTTP Headers/Body', 'Postman requests', 'REST Assured / Axios', 'JSON schema validation', 'Mock APIs'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔗',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'API Testing with Postman', url: ytUrl('API testing Postman') }],
      aiTip: 'Always check status codes, response times, and payloads when automating API validation tests.',
      interviewQuestions: ['How to validate JSON response in Postman?', 'REST vs SOAP APIs?', 'What is contract testing?']
    },
    {
      title: 'Performance & Security Testing',
      description: 'Verify system performance and vulnerability checking.',
      topics: ['JMeter load testing', 'Load vs Stress testing', 'OWASP Top 10 for QA', 'Security scanning basics'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '📈',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'JMeter Load Testing', url: ytUrl('JMeter performance testing') }],
      aiTip: 'Run performance benchmarks before making a major release to detect memory leaks and bottlenecks.',
      interviewQuestions: ['Load testing vs Stress testing?', 'What is OWASP Top 10?', 'How to measure peak API response times?']
    },
    {
      title: 'CI/CD & DevOps for QA',
      description: 'Run automated tests in deployment pipelines.',
      topics: ['Jenkins test jobs', 'GitHub Actions workflow', 'Docker for QA', 'Reporter utilities (Allure)'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🚀',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'CI/CD Automation Tests', url: ytUrl('CI/CD test automation') }],
      aiTip: 'Automated tests must run on every pull request to ensure regressions are caught before staging.',
      interviewQuestions: ['How do you integrate tests in Jenkins?', 'What is a headles browser?', 'What are docker containers?']
    },
    {
      title: 'Database Testing',
      description: 'Write database queries to validate backend records.',
      topics: ['SQL SELECT & WHERE', 'Data Integrity', 'Joins & Unions', 'NoSQL validation'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🗄️',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'SQL for Testers', url: ytUrl('SQL testing queries') }],
      aiTip: 'Write SQL assertions to verify that details saved in UI are written correctly to the database.',
      interviewQuestions: ['Explain Joins in SQL.', 'How to check database indexes?', 'What is database integrity testing?']
    },
    {
      title: 'Capstone QA Framework',
      description: 'Deploy a complete test framework with logging and reporting.',
      topics: ['Framework from Scratch', 'CI/CD trigger', 'Allure Reporting', 'Github Repository', 'Test Documentation'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'QA Framework Project', url: ytUrl('QA framework github project') }],
      aiTip: 'A complete framework that runs in GitHub Actions and sends reports to Slack is a high-impact portfolio item.',
      interviewQuestions: ['Walk me through your custom framework.', 'How do you handle flaky tests?', 'How to report bugs automatically?']
    }
  ],
  'Cybersecurity': [
    {
      title: 'Networking & OS Basics',
      description: 'Learn foundations of networking protocols and operating systems.',
      topics: ['TCP/IP Suite', 'OSI Layers', 'Linux Basics', 'Windows security basics', 'DNS & HTTP'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🌐',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Cybersecurity Networking', url: ytUrl('cybersecurity networking OSI') }],
      aiTip: 'Every security professional must know the OSI model. Focus on TCP vs UDP and network ports.',
      interviewQuestions: ['OSI model layers?', 'TCP vs UDP?', 'How does DNS lookup work?']
    },
    {
      title: 'Security Tools & Crypto',
      description: 'Master standard tools and cryptography protocols.',
      topics: ['Wireshark', 'Nmap scanning', 'Hashing vs Encryption', 'Symmetric vs Asymmetric', 'SSH/TLS'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔐',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Wireshark Nmap Tutorial', url: ytUrl('Wireshark Nmap security') }],
      aiTip: 'Wireshark is the standard for packet analysis. Practice filtering traffic by protocol (e.g. http).',
      interviewQuestions: ['Hashing vs Encryption?', 'Explain Diffie-Hellman.', 'How to filter packets in Wireshark?']
    },
    {
      title: 'Threats & Pen Testing',
      description: 'Learn vulnerability analysis and white-hat hacking.',
      topics: ['OWASP Web Vulnerabilities', 'Burp Suite', 'Metasploit Basics', 'SQL Injection', 'XSS attacks'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '💀',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Penetration Testing Course', url: ytUrl('penetration testing Metasploit Burp') }],
      aiTip: 'Understand the mechanics of vulnerabilities. Do not just run tools; know how to fix the gaps.',
      interviewQuestions: ['What is SQL Injection?', 'Stored vs Reflected XSS?', 'How does Burp Suite proxy work?']
    },
    {
      title: 'Incident Response & SOC',
      description: 'Monitor logs and analyze security incidents.',
      topics: ['SIEM (Splunk/ELK)', 'Log Analysis', 'Incident Handling phases', 'Firewalls & IDS/IPS'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '📊',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'SOC Splunk Tutorial', url: ytUrl('SOC SIEM Splunk logs') }],
      aiTip: 'Log aggregation is crucial. Learn to query logs to construct a timeline of security incidents.',
      interviewQuestions: ['What is SIEM?', 'Describe incident handling steps.', 'IDS vs IPS firewalls?']
    },
    {
      title: 'Cloud Security & DevSecOps',
      description: 'Protect cloud infrastructures and build pipelines.',
      topics: ['AWS IAM Policies', 'Container Vulnerability scan', 'Vault Secrets', 'Network Security Policies'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '☁️',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Cloud Security Tutorial', url: ytUrl('cloud security AWS DevSecOps') }],
      aiTip: 'Enforce the principle of least privilege in IAM policies. Never hardcode credentials.',
      interviewQuestions: ['What is Zero Trust?', 'How to manage secrets in CI/CD?', 'What is a VPC Security Group?']
    },
    {
      title: 'Audit & Compliance',
      description: 'Review security compliance and governance standard frameworks.',
      topics: ['ISO 27001 standard', 'SOC 2 report standard', 'GDPR/HIPAA compliance', 'Threat Modeling (STRIDE)'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '📋',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Security Audit compliance', url: ytUrl('security compliance ISO 27001') }],
      aiTip: 'Compliance is not security, but security is incomplete without proper compliance and auditing.',
      interviewQuestions: ['What is STRIDE threat model?', 'ISO 27001 vs SOC 2?', 'What is a risk register?']
    },
    {
      title: 'Capstone Security Assessment',
      description: 'Deploy secure topology or construct audit report.',
      topics: ['Vulnerability Scan Report', 'Secure Network Setup', 'Threat Mitigation document', 'GitHub documentation'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Security Project Ideas', url: ytUrl('security pentesting report project') }],
      aiTip: 'Writing a detailed threat assessment and mitigation report showcases analytical cybersecurity capabilities.',
      interviewQuestions: ['How did you structure your audit report?', 'Mitigation strategy for SQLi?', 'How to configure a SIEM dashboard?']
    }
  ],
  'Database & Data': [
    {
      title: 'Relational Database Fundamentals',
      description: 'Master SQL, joins, schema design, and normal forms.',
      topics: ['SQL Queries', 'Inner/Outer Joins', 'Database Normalization', 'Constraints & Keys', 'PostgreSQL/MySQL'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🗄️',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'SQL Database Course', url: ytUrl('SQL database normalization') }],
      aiTip: 'Focus on database normalization (1NF, 2NF, 3NF). It prevents redundancies and maintains integrity.',
      interviewQuestions: ['Explain 3rd Normal Form.', 'Left Join vs Right Join?', 'Primary key vs Unique key?']
    },
    {
      title: 'NoSQL & Big Data',
      description: 'Learn NoSQL paradigms and storage formats.',
      topics: ['MongoDB Documents', 'Redis Caching', 'Cassandra basics', 'JSON data format', 'Key-Value databases'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '📊',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'NoSQL MongoDB Tutorial', url: ytUrl('NoSQL MongoDB Redis') }],
      aiTip: 'Choose NoSQL when data structure is highly dynamic or horizontal scaling is a primary concern.',
      interviewQuestions: ['SQL vs NoSQL?', 'How does caching work with Redis?', 'What is a document store?']
    },
    {
      title: 'ETL Pipelines',
      description: 'Learn data extract, transform, and load workflows.',
      topics: ['Data ingestion', 'ETL design patterns', 'Apache Airflow orchestrator', 'Python scripts (pandas)', 'Cron schedules'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '🔁',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'ETL Pipelines Airflow', url: ytUrl('ETL pipelines Python Airflow') }],
      aiTip: 'Build idempotent pipelines — running them multiple times should produce the same outputs without duplicates.',
      interviewQuestions: ['What is ETL?', 'Why use Apache Airflow?', 'Explain data pipeline idempotency.']
    },
    {
      title: 'Data Warehouses',
      description: 'Model data for analytics and dashboard tools.',
      topics: ['Snowflake / BigQuery', 'Star & Snowflake schemas', 'dbt (data build tool)', 'Fact & Dimension tables'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '🏢',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'dbt Snowflake Warehouse', url: ytUrl('Snowflake dbt data warehouse') }],
      aiTip: 'Star schemas speed up aggregations. Fact tables hold metrics; dimension tables hold descriptive data.',
      interviewQuestions: ['Star vs Snowflake schema?', 'Fact table vs Dimension table?', 'What does dbt do?']
    },
    {
      title: 'Big Data Processing',
      description: 'Scale queries using Spark and distributed frameworks.',
      topics: ['Apache Spark', 'PySpark', 'Hadoop HDFS', 'MapReduce basics', 'Parquet file format'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '⚡',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Apache Spark PySpark', url: ytUrl('Apache Spark PySpark tutorial') }],
      aiTip: 'Spark processes data in memory. Optimize operations by caching datasets that are reused multiple times.',
      interviewQuestions: ['How does Spark perform in-memory calculation?', 'Parquet vs CSV storage?', 'What is MapReduce?']
    },
    {
      title: 'Database Admin & Tuning',
      description: 'Administer databases and optimize performance query execution.',
      topics: ['SQL Indexes', 'Explain Plan analysis', 'Database Replication', 'Sharding & Partitioning', 'Backup strategies'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '⚙️',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Database Administration tuning', url: ytUrl('database tuning indexing sharding') }],
      aiTip: 'Analyze query execution plans (EXPLAIN) to identify missing indexes or sequential table scans.',
      interviewQuestions: ['Explain sharding vs replication.', 'How to resolve slow SQL queries?', 'What is a clustered index?']
    },
    {
      title: 'Capstone Data Warehouse',
      description: 'Build an end-to-end data platform with pipelines.',
      topics: ['ETL pipeline', 'dbt models', 'Warehouse dashboard', 'Unit testing models', 'GitHub deployment'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Data Pipeline project', url: ytUrl('data engineering pipeline github project') }],
      aiTip: 'A portfolio data engineering project with clean pipeline logs and automated testing stands out to recruiters.',
      interviewQuestions: ['Walk me through your ingestion pipeline.', 'How do you handle schema changes?', 'What metrics did you track?']
    }
  ],
  'Networking & Infra': [
    {
      title: 'Networking Fundamentals',
      description: 'Learn routing, switching, IP addressing, and subnetting.',
      topics: ['TCP/IP & OSI Models', 'IP Subnetting (IPv4/IPv6)', 'Routing Protocols (OSPF/BGP)', 'DHCP, DNS, NAT'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🌐',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Networking Fundamentals CCNA', url: ytUrl('networking subnetting CCNA') }],
      aiTip: 'Practice subnetting calculations manually. It is heavily tested in junior network engineer screening.',
      interviewQuestions: ['Subnet a /24 network into 4 subnets.', 'How does BGP routing work?', 'DHCP allocation steps?']
    },
    {
      title: 'System Administration',
      description: 'Master server OS administration and automation scripts.',
      topics: ['Linux Administration', 'Windows Server Active Directory', 'Bash / PowerShell Scripting', 'User Roles & Permissions'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🐧',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Linux System Admin', url: ytUrl('Linux administration Active Directory') }],
      aiTip: 'Active Directory governs access. Learn to write scripts that automate bulk user provisioning.',
      interviewQuestions: ['How to manage permissions in Linux?', 'What is Active Directory GPO?', 'Write a backup bash script.']
    },
    {
      title: 'Network Hardware & Firewalls',
      description: 'Understand router configurations and firewalls.',
      topics: ['Switch & Router configuration', 'Firewall ACL rules', 'VLAN configurations', 'VPN tunnels (IPsec)'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔌',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Cisco Routing VLAN', url: ytUrl('Cisco routing switching VLAN') }],
      aiTip: 'VLANs segment broadcast traffic to improve security and performance. Apply firewall ACLs on borders.',
      interviewQuestions: ['What is a VLAN?', 'Configure IPsec VPN rules.', 'ACL rule priority?']
    },
    {
      title: 'Security & Monitoring',
      description: 'Learn network vulnerability checks and monitoring systems.',
      topics: ['Intrusion Detection (IDS/IPS)', 'Network monitoring (Nagios/Zabbix)', 'Packet capture (Wireshark)', 'Syslog analysis'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '📊',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'Network Monitoring Wireshark', url: ytUrl('network monitoring Wireshark Nagios') }],
      aiTip: 'Monitor CPU, bandwidth, and errors. Configure syslog alerts for failed login notifications.',
      interviewQuestions: ['IDS vs IPS?', 'Wireshark packet capture analysis?', 'Explain SNMP protocol.']
    },
    {
      title: 'Virtualization & Cloud Net',
      description: 'Deploy software-defined networks in virtual/cloud models.',
      topics: ['VMware / Hyper-V', 'AWS VPC design', 'Load Balancers', 'Software Defined Networking (SDN)'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '☁',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Cloud VPC VMware networking', url: ytUrl('AWS VPC SDN VMware') }],
      aiTip: 'VPC design requires careful planning of IP CIDR blocks to avoid overlapping ranges in peer networks.',
      interviewQuestions: ['What is SDN?', 'VPC subnets configuration?', 'Hyper-V vs VMware?']
    },
    {
      title: 'Infrastructure Automation',
      description: 'Manage network infrastructure configurations as code.',
      topics: ['Ansible playbooks', 'Python Network libraries (Netmiko)', 'Git versioning configurations'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '⚙️',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Ansible Netmiko Automation', url: ytUrl('Ansible Netmiko network automation') }],
      aiTip: 'Use Ansible to automate firmware upgrades or ACL deployments across hundreds of switches simultaneously.',
      interviewQuestions: ['Ansible Playbook structure?', 'How does Netmiko interact with hardware?', 'Git version controls for config?']
    },
    {
      title: 'Capstone Network Design',
      description: 'Build a secure, segmented corporate network environment.',
      topics: ['Subnet structure design', 'VLAN & routing configuration', 'Firewall policies', 'Monitoring alerts configured'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Network Topology Project', url: ytUrl('packet tracer network design project') }],
      aiTip: 'Design high availability (redundant routers, dual ISP links) to eliminate single points of failure.',
      interviewQuestions: ['Explain your network topology.', 'How did you secure routing updates?', 'Failover mechanism design?']
    }
  ],
  'Cloud & Platform': [
    {
      title: 'Cloud Infrastructure Basics',
      description: 'Understand cloud services on AWS, Azure, or GCP.',
      topics: ['IaaS vs PaaS vs SaaS', 'VPC & Networking', 'IAM Users & Groups', 'Compute instances', 'Cloud Storage'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '☁️',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'AWS Cloud Basics', url: ytUrl('AWS Practitioner cloud fundamentals') }],
      aiTip: 'Focus on identity access management (IAM) first. Secure your root accounts immediately.',
      interviewQuestions: ['What is IaaS vs PaaS?', 'What is a security group?', 'How does IAM work?']
    },
    {
      title: 'Containers & Docker',
      description: 'Package applications into Docker containers.',
      topics: ['Dockerfiles', 'Docker Compose', 'Image layer caching', 'Volume mounts', 'Container networks'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🐳',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Docker Containers Course', url: ytUrl('Docker containerization basics') }],
      aiTip: 'Keep your images minimal. Use alpine bases and multi-stage builds to optimize load times.',
      interviewQuestions: ['Dockerfile vs Docker Compose?', 'How do you reduce Docker image size?', 'Docker volume mapping?']
    },
    {
      title: 'Kubernetes & Orchestration',
      description: 'Orchestrate container workloads at scale.',
      topics: ['K8s Pods & Deployments', 'Services & Ingress', 'ConfigMaps & Secrets', 'Horizontal Pod Autoscaler (HPA)'],
      duration: '4 Weeks',
      difficulty: 'Advanced',
      icon: '☸️',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Kubernetes Crash Course', url: ytUrl('Kubernetes orchestration pods') }],
      aiTip: 'Always configure readiness and liveness probes in your deployments to prevent routing traffic to dead pods.',
      interviewQuestions: ['Deployment vs StateFulSet?', 'What is Ingress?', 'How does HPA autoscale pods?']
    },
    {
      title: 'Infrastructure as Code (IaC)',
      description: 'Provision cloud instances using code declarations.',
      topics: ['Terraform syntax', 'State management', 'Modules', 'Terraform Plan vs Apply'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '🏗️',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'Terraform IaC Course', url: ytUrl('Terraform infrastructure as code') }],
      aiTip: 'Store your Terraform state files in a remote cloud bucket with state locking enabled (e.g. DynamoDB).',
      interviewQuestions: ['What is Terraform State?', 'Terraform plan vs apply?', 'How to structure modular code?']
    },
    {
      title: 'Serverless Architecture',
      description: 'Design stateless applications with managed services.',
      topics: ['AWS Lambda / Azure Functions', 'API Gateway integration', 'Serverless Framework / SAM', 'Cold starts'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '⚡',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'AWS Lambda Serverless', url: ytUrl('AWS Lambda serverless Gateway') }],
      aiTip: 'Lambda code should remain lightweight. Initialize databases outside the handler function to reuse sessions.',
      interviewQuestions: ['What is a Lambda cold start?', 'API Gateway routing?', 'Serverless pros vs cons?']
    },
    {
      title: 'Observability & Monitoring',
      description: 'Expose metrics, logs, and alerting systems.',
      topics: ['Prometheus metrics collection', 'Grafana Dashboards', 'Alertmanager notifications', 'Elasticsearch logs'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '📊',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Prometheus Grafana Observability', url: ytUrl('Prometheus Grafana metrics dashboard') }],
      aiTip: 'Collect standard RED metrics (Rate, Errors, Duration) for service health monitoring.',
      interviewQuestions: ['Metrics vs Logs vs Traces?', 'How does Prometheus scrape metrics?', 'Set up alerting thresholds.']
    },
    {
      title: 'Capstone Kubernetes Platform',
      description: 'Deploy microservices on Kubernetes using Terraform.',
      topics: ['K8s Cluster via Terraform', 'Ingress controller configure', 'Helm charts setup', 'GitHub Actions pipeline'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'DevOps Cloud project', url: ytUrl('kubernetes terraform github action project') }],
      aiTip: 'Secure secrets usage in Helm. Ensure all secrets are pulled from secure parameter stores at run-time.',
      interviewQuestions: ['Walk me through your cluster deploy configuration.', 'Secrets management choice?', 'How to handle rollbacks?']
    }
  ],
  'ERP & Enterprise': [
    {
      title: 'ERP Foundations',
      description: 'Learn enterprise core data schemas and process maps.',
      topics: ['Sales / Purchase Ledger', 'Inventory pipelines', 'Client Master records', 'ERP architecture flow'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🏢',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'ERP systems lifecycle', url: ytUrl('ERP business processes SAP Salesforce') }],
      aiTip: 'Understand the business flow first (e.g. Quote-to-Cash, Procure-to-Pay) before coding modules.',
      interviewQuestions: ['What is ERP?', 'Describe the Quote-to-Cash process.', 'ERP database architecture principles?']
    },
    {
      title: 'Enterprise Scripting',
      description: 'Learn programming languages used in ERP (ABAP / Apex).',
      topics: ['Apex / ABAP syntax', 'Variables & loops', 'Triggers & events', 'Database query language (SOQL)'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '💻',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'ABAP Apex programming', url: ytUrl('Salesforce Apex SAP ABAP coding') }],
      aiTip: 'Write bulkified code. Avoid writing database queries inside loops as it triggers governor limits.',
      interviewQuestions: ['What are governor limits?', 'Write a basic database trigger.', 'Bulkification defined?']
    },
    {
      title: 'ERP Customization',
      description: 'Configure standard fields, user roles, layouts.',
      topics: ['Object Schema Customization', 'Page layouts editor', 'Permission sets & Profiles', 'Validation rules'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '⚙️',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Salesforce SAP configuring', url: ytUrl('Salesforce admin SAP customization') }],
      aiTip: 'Configuration is preferred over custom code in ERP platforms. Use standard features first.',
      interviewQuestions: ['Validation rules configuration?', 'Profile vs Permission set?', 'Custom objects schema?']
    },
    {
      title: 'APIs & Integration',
      description: 'Connect ERP systems with external REST APIs.',
      topics: ['REST / SOAP callouts', 'MuleSoft / middleware', 'JSON payloads', 'OAuth authentication'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔗',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'ERP APIs Integration', url: ytUrl('Salesforce SAP integration REST SOAP') }],
      aiTip: 'Manage system downtime gracefully. Store failed payloads in queues for retry when endpoints resume.',
      interviewQuestions: ['REST vs SOAP callouts?', 'OAuth token authorization in ERP?', 'Middleware usage?']
    },
    {
      title: 'Reporting & Dashboards',
      description: 'Build reports for enterprise stakeholders.',
      topics: ['SOQL aggregates', 'SAP Analytics Cloud', 'Reports & Charts builder', 'Data imports/exports'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '📊',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'ERP analytics reports', url: ytUrl('Salesforce dashboards SAP analytics') }],
      aiTip: 'Design charts that display key performance indicators (KPIs) clearly on the home screen dashboards.',
      interviewQuestions: ['Create a summary report query.', 'Data loader usage?', 'Export formats support?']
    },
    {
      title: 'Governance & Security',
      description: 'Manage audits, release pipelines, sandboxes.',
      topics: ['Sandbox environments', 'Change-sets deployment', 'Field-level security', 'Audit trails'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🔐',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'ERP release management', url: ytUrl('Salesforce DX SAP deployment transport') }],
      aiTip: 'Never test code in production. Deploy using change sets or devops pipelines from developers sandbox.',
      interviewQuestions: ['Change set deployment steps?', 'Sandbox types explained.', 'Field-level security settings?']
    },
    {
      title: 'Capstone ERP Module',
      description: 'Deploy a customized business module with validation.',
      topics: ['Custom objects pipeline', 'Triggers automated logic', 'Dashboard reports configured', 'Unit tests written'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Enterprise App Project', url: ytUrl('Salesforce custom app github project') }],
      aiTip: 'Write comprehensive test classes that cover at least 75% of your customized trigger statements.',
      interviewQuestions: ['Walk me through your custom module flow.', 'Write unit test code.', 'Governor limits mitigated?']
    }
  ],
  'Product & Business': [
    {
      title: 'Requirements Engineering',
      description: 'Learn to extract requirements and structure tasks.',
      topics: ['User Persona mapping', 'User Stories & Epics', 'Backlog grooming', 'Product requirement documents (PRD)'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '📋',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Product Management Requirements', url: ytUrl('product management user stories PRD') }],
      aiTip: 'Write user stories in the standard template: As a [User], I want to [Action], so that [Benefit].',
      interviewQuestions: ['What makes a good user story?', 'Explain backlog prioritization.', 'What is inside a PRD?']
    },
    {
      title: 'Product Strategy & Roadmap',
      description: 'Define MVP scoping and product features maps.',
      topics: ['Minimum Viable Product (MVP)', 'Product Roadmaps', 'Competitor Analysis', 'Value Proposition Canvas'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🗺️',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Product Roadmapping', url: ytUrl('product roadmap strategy MVP') }],
      aiTip: 'Focus your MVP on solving one core user pain point exceptionally well, rather than adding multiple features.',
      interviewQuestions: ['How do you define MVP?', 'How to create a product roadmap?', 'Value proposition matching?']
    },
    {
      title: 'Agile & Scrum',
      description: 'Lead sprints using Scrum frameworks.',
      topics: ['Scrum team roles', 'Sprint Planning & Retrospective', 'Jira Boards', 'Velocity metrics'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔄',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Agile Scrum tutorial', url: ytUrl('agile scrum tutorial Jira') }],
      aiTip: 'Retrospectives are about processes, not pointing fingers. Focus sprints on continuous improvements.',
      interviewQuestions: ['Scrum master vs Product owner?', 'How to facilitate sprint planning?', 'What is velocity?']
    },
    {
      title: 'Product Analytics',
      description: 'Collect metrics to track product health.',
      topics: ['KPIs (Retention/Churn)', 'A/B Testing parameters', 'Google Analytics / Mixpanel', 'User Funnels'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '📊',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'Product analytics metrics', url: ytUrl('product analytics metrics retention A/B') }],
      aiTip: 'Identify the North Star Metric of your product — the single metric that represents value delivered.',
      interviewQuestions: ['Define user retention and churn.', 'How to run A/B testing?', 'North Star Metric examples?']
    },
    {
      title: 'UX & Design Thinking',
      description: 'Align product scoping with design maps.',
      topics: ['Wireframes basics', 'Design thinking phases', 'User feedback loops', 'Figma basics for PMs'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🎨',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Design thinking Product PM', url: ytUrl('design thinking product managers Figma') }],
      aiTip: 'Validate designs with quick paper mockups first. Test layouts before writing full specifications.',
      interviewQuestions: ['Explain phases of design thinking.', 'How to gather user feedback?', 'Evaluate wireframes.']
    },
    {
      title: 'Stakeholder Communication',
      description: 'Manage stakeholder expectations and reports.',
      topics: ['Expectation alignment', 'Roadmap updates presentation', 'Risk Mitigation logging', 'Public speaking'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🤝',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Stakeholder management PM', url: ytUrl('stakeholder management soft skills PM') }],
      aiTip: 'Communicate the "Why" behind product decisions. Stakeholders accept "No" when backed by metrics.',
      interviewQuestions: ['How to tell a stakeholder No?', 'Handle conflicting feature demands?', 'Risk logs updates?']
    },
    {
      title: 'Capstone Product Proposal',
      description: 'Produce a complete PRD and prototype roadmap.',
      topics: ['PRD completed', 'Figma wireframes link', 'Sprint plans roadmap', 'Analytics tracking setup'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Product Case Study', url: ytUrl('product manager case study project') }],
      aiTip: 'Write a comprehensive PRD that answers all corner-cases. Present a walkthrough video of your designs.',
      interviewQuestions: ['Walk me through your PRD.', 'Explain your prioritization choice.', 'How will you measure launch success?']
    }
  ],
  'UI/UX & Design': [
    {
      title: 'Design Principles',
      description: 'Learn hierarchy, color theory, typography.',
      topics: ['Visual Hierarchy', 'Color Theory & Harmony', 'Typography matching', 'Grid systems (8pt grid)', 'Layouts basics'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🎨',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'UI Design Principles', url: ytUrl('UI design principles typography color') }],
      aiTip: 'Always use an 8px grid system. It keeps elements aligned and layout systems clean across screen widths.',
      interviewQuestions: ['What is visual hierarchy?', 'Explain color harmony.', 'Why use an 8px grid system?']
    },
    {
      title: 'UX Research',
      description: 'Conduct user research and maps journeys.',
      topics: ['User Interviews', 'Personas definition', 'Empathy Maps', 'User Journey mapping', 'Information Architecture'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔍',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'UX Research Journey mapping', url: ytUrl('UX research journey mapping IA') }],
      aiTip: 'Validate assumptions by interviewing actual users. Ask open questions rather than leading ones.',
      interviewQuestions: ['How to conduct user interviews?', 'What is empathy mapping?', 'Define Information Architecture.']
    },
    {
      title: 'Figma Mastery',
      description: 'Master industry-standard layout prototyping tools.',
      topics: ['Figma Auto Layout', 'Components & Variants', 'Vector drawing tools', 'Design Systems usage'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '📐',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Figma Auto Layout Course', url: ytUrl('Figma auto layout components variant') }],
      aiTip: 'Master auto layout. It replicates CSS flexbox behaviors directly inside design environments.',
      interviewQuestions: ['Figma Auto Layout vs absolute layouts?', 'What are component variants?', 'Design token uses?']
    },
    {
      title: 'Interactive Prototyping',
      description: 'Add micro-animations and custom transitions.',
      topics: ['Figma Smart Animate', 'Transitions & triggers', 'High-fidelity user test prototypes', 'Interactive elements'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '⚡',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'Figma Prototyping Smart Animate', url: ytUrl('Figma smart animate prototyping') }],
      aiTip: 'Use smart animate to mock actual transitions. High fidelity builds improve user testing accuracy.',
      interviewQuestions: ['Smart Animate triggers?', 'High fidelity vs low fidelity prototypes?', 'What is a micro-interaction?']
    },
    {
      title: 'Design Systems',
      description: 'Build component libraries for UI consistency.',
      topics: ['Design Tokens (colors/spacing)', 'Button components variants', 'Input forms standards', 'Developer handoff setup'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '⚙️',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Building Design Systems Figma', url: ytUrl('Figma design systems tokens components') }],
      aiTip: 'Organize pages cleanly inside Figma. Set layout inspect views to allow developers to view css rules.',
      interviewQuestions: ['What are design tokens?', 'Structure developer handoffs.', 'How does component naming work?']
    },
    {
      title: 'Usability Testing',
      description: 'Analyze user interactions and refine layouts.',
      topics: ['A/B Testing visuals', 'Heatmaps (Hotjar basics)', 'User testing reports', 'Heuristic Evaluation'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🧪',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Usability Testing UX', url: ytUrl('usability testing UX heuristic evaluation') }],
      aiTip: 'Perform heuristic evaluations to detect standard usability bugs before testing actual designs with clients.',
      interviewQuestions: ['What is heuristic evaluation?', 'How to run A/B usability tests?', 'Explain heatmaps.']
    },
    {
      title: 'Capstone Design Portfolio',
      description: 'Build design systems and final prototypes.',
      topics: ['Figma interactive link', 'Case Study description', 'Design Tokens documented', 'Usability reports link'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'UX Case Study', url: ytUrl('UI UX portfolio case study project') }],
      aiTip: 'A great UX case study details your research process, user testing results, and layouts iterations.',
      interviewQuestions: ['Walk me through your case study.', 'Iterating layout decisions?', 'Figma inspect configs?']
    }
  ],
  'AI & Emerging': [
    {
      title: 'Python & AI Basics',
      description: 'Learn Python programming and statistical math.',
      topics: ['Python Syntax', 'NumPy & Pandas', 'Probability & Stats', 'Linear Algebra basics'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🐍',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Python for AI', url: ytUrl('Python AI machine learning fundamentals') }],
      aiTip: 'Python is standard in AI development. Focus on manipulating data frames with Pandas.',
      interviewQuestions: ['Why use NumPy over list objects?', 'Normal distribution variables?', 'Explain matrix multiplications.']
    },
    {
      title: 'NLP & Vision Basics',
      description: 'Learn basics of text and image parsing.',
      topics: ['NLTK syntax', 'OpenCV basics', 'Tokenization & parsing', 'Image processing filters'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '👁️',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'NLP Vision OpenCV', url: ytUrl('NLP OpenCV computer vision basics') }],
      aiTip: 'Preprocess images (grayscale, resize) before passing them to convolutional models to accelerate operations.',
      interviewQuestions: ['Tokenization vs Lemmatization?', 'How does edge detection work?', 'Explain image histograms.']
    },
    {
      title: 'Generative AI & Prompts',
      description: 'Learn prompt engineering models and LLMs.',
      topics: ['OpenAI APIs', 'Prompt patterns (few-shot)', 'Temperature & parameter rules', 'Token limits mitigation'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🤖',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Prompt Engineering LLM', url: ytUrl('prompt engineering few shot OpenAI API') }],
      aiTip: 'Few-shot prompting provides context examples. It directs the output formatting cleanly without training.',
      interviewQuestions: ['Few-shot vs Zero-shot prompt?', 'What does temperature adjust?', 'How to avoid LLM hallucinations?']
    },
    {
      title: 'RAG & Vector Databases',
      description: 'Build RAG integrations using vector indexes.',
      topics: ['LangChain / LlamaIndex', 'Pinecone / ChromaDB', 'Document embeddings', 'Semantic searches'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '🗄️',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'LangChain RAG ChromaDB', url: ytUrl('LangChain RAG vector database ChromaDB') }],
      aiTip: 'Retrieval Augmented Generation (RAG) feeds document context to prompt statements, avoiding fine-tuning.',
      interviewQuestions: ['Explain RAG workflow.', 'What is document embedding?', 'Why use a vector database?']
    },
    {
      title: 'Agentic Architectures',
      description: 'Build reasoning agents with tool usage.',
      topics: ['LangGraph / AutoGen', 'Tool definitions', 'Routing logic loops', 'Multi-agent networks'],
      duration: '3 Weeks',
      difficulty: 'Advanced',
      icon: '⚙️',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'AI Agents LangGraph', url: ytUrl('AI agents tool use LangGraph') }],
      aiTip: 'Equip agents with specific tools (e.g. database query, math helper). Limit execution loops to avoid runaway costs.',
      interviewQuestions: ['What are AI agents?', 'Agent tool calling mechanism?', 'Graph routing logic loops?']
    },
    {
      title: 'Evaluation & Tuning',
      description: 'Optimize prompts and check response outputs.',
      topics: ['Ragas evaluation tool', 'Prompt logging (LangSmith)', 'Response metrics checking', 'Fine-tuning datasets'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🧪',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Evaluating LLM app Ragas', url: ytUrl('LLM evaluation LangSmith Ragas') }],
      aiTip: 'Measure retrieval precision and faithfulness. Logs monitor exactly where prompts fail.',
      interviewQuestions: ['How to evaluate RAG models?', 'Faithfulness metric definition?', 'LangSmith utility?']
    },
    {
      title: 'Capstone AI Application',
      description: 'Deploy an AI RAG app with tool configurations.',
      topics: ['LangChain server code', 'Vector database deployed', 'UI Chat Interface', 'Automated test suite'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'AI RAG Project', url: ytUrl('RAG chatbot application project github') }],
      aiTip: 'Provide a clean user chat interface and deploy on platforms like Streamlit, Vercel, or Docker.',
      interviewQuestions: ['Walk me through your agentic code.', 'How did you parse files?', 'How to optimize vector search speeds?']
    }
  ],
  'Blockchain & Web3': [
    {
      title: 'Blockchain Basics',
      description: 'Learn block cryptography rules and networks.',
      topics: ['Hashing (SHA-256)', 'Consensus (PoW / PoS)', 'Wallets & Private Keys', 'Node structures'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '⛓️',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Blockchain cryptography', url: ytUrl('blockchain basics proof of work') }],
      aiTip: 'Understand the difference between Proof of Work and Proof of Stake. Practice private key signing.',
      interviewQuestions: ['PoW vs PoS consensus?', 'How do block headers link?', 'Asymmetric keys use in wallets?']
    },
    {
      title: 'Smart Contracts',
      description: 'Code contracts using Solidity or Rust.',
      topics: ['Solidity syntax', 'State variables', 'Functions modifiers', 'Event emissions', 'Mapping arrays'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '📜',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Solidity Smart Contracts', url: ytUrl('Solidity smart contract course') }],
      aiTip: 'State writes cost gas on Ethereum. Keep your contract variables compact to optimize executions.',
      interviewQuestions: ['What is a state modifier?', 'Memory vs Storage keywords?', 'Write a basic transfer contract.']
    },
    {
      title: 'Web3 Frameworks',
      description: 'Use developer toolchains to compile contracts.',
      topics: ['Hardhat / Foundry', 'Ethers.js / Web3.js', 'Contract compilations', 'Testing contract rules'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🛠️',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'Hardhat Foundry tutorial', url: ytUrl('Hardhat Foundry Web3 tutorial') }],
      aiTip: 'Foundry runs tests in Rust, making it extremely fast. Use it for fuzz testing contract boundary values.',
      interviewQuestions: ['Hardhat vs Foundry toolchains?', 'Write contract unit test assertions.', 'What is fuzz testing?']
    },
    {
      title: 'Decentralized Apps (DApps)',
      description: 'Connect UI components to smart contracts.',
      topics: ['React Web3 Provider', 'MetaMask wallet trigger', 'Contract instance read/write', 'Loading states'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '📱',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'Build DApp React', url: ytUrl('DApp react build wallet connect') }],
      aiTip: 'Always handle wallet disconnect and network switches gracefully (e.g. from Mainnet to Testnet).',
      interviewQuestions: ['Connect React to contract APIs.', 'Handle wallet disconnection event.', 'Write transaction loading UI.']
    },
    {
      title: 'Tokens & NFTs',
      description: 'Master standard ERC token templates.',
      topics: ['ERC-20 token standard', 'ERC-721 NFT standard', 'OpenZeppelin libraries', 'Minting logic'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🎟️',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'ERC20 ERC721 tokens', url: ytUrl('ERC20 ERC721 OpenZeppelin tutorial') }],
      aiTip: 'Use OpenZeppelin templates. They are audited and secure, preventing standard bugs like reentrancy.',
      interviewQuestions: ['ERC-20 vs ERC-721?', 'OpenZeppelin library advantages?', 'Write minting trigger limits.']
    },
    {
      title: 'L2 & Decentralized Storage',
      description: 'Scale systems and host files in L2 patterns.',
      topics: ['Arbitrum / Optimism', 'IPFS storage', 'Infura node API gateway', 'Cross-chain bridges basics'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '⚙️',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'IPFS L2 scaling', url: ytUrl('IPFS storage Arbitrum Optimism') }],
      aiTip: 'IPFS files are immutable. Store the IPFS hash inside contract variables for references.',
      interviewQuestions: ['What is IPFS?', 'Why use Layer 2 networks?', 'Infura API advantages?']
    },
    {
      title: 'Capstone DApp Project',
      description: 'Deploy a complete DApp with verified contracts.',
      topics: ['Verified Smart Contract', 'Wallet Connect UI interface', 'IPFS image hosting', 'Mocha tests written'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Blockchain project DApp', url: ytUrl('DApp portfolio project github') }],
      aiTip: 'Verify contract code on Etherscan so users can read your public variables directly from the explorer.',
      interviewQuestions: ['Walk me through your code.', 'How did you prevent contract bugs?', 'Gas consumption optimization choice?']
    }
  ],
  'Technical Writing': [
    {
      title: 'Writing Basics',
      description: 'Learn clear styles, active voice, documentation guides.',
      topics: ['Microsoft Manual of Style', 'Active voice writing', 'Structuring instructions', 'Document schemas'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '✍️',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Technical writing style guide', url: ytUrl('technical writing style guide active voice') }],
      aiTip: 'Write simply. Avoid jargon and write in the active voice: e.g. Click Submit, not The submit button must be clicked.',
      interviewQuestions: ['Active vs Passive voice?', 'Describe MS style guide.', 'How to explain difficult topics?']
    },
    {
      title: 'Doc Tools & Markdown',
      description: 'Write docs using Markdown and version controls.',
      topics: ['Markdown formatting', 'Git commands', 'Hugo / Docusaurus sites', 'YAML frontmatter configurations'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '📄',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Docs as Code static site', url: ytUrl('markdown static site generator Docusaurus') }],
      aiTip: 'Use a Docs-as-Code model. Write in Markdown, version in Git, and deploy automatically via CI/CD.',
      interviewQuestions: ['Docs-as-code benefits?', 'Markdown syntax elements?', 'Static site config steps?']
    },
    {
      title: 'API Documenting',
      description: 'Produce Swagger/OpenAPI documentation files.',
      topics: ['OpenAPI specifications (YAML)', 'Swagger UI dashboards', 'API parameters tables', 'Request/Response samples'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '🔗',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'API Documentation swagger', url: ytUrl('API documentation swagger OpenAPI') }],
      aiTip: 'Provide clear, functional request examples with actual parameters so developers can test immediately.',
      interviewQuestions: ['Write an OpenAPI spec block.', 'API parameter tables formatting?', 'Explain Swagger UI.']
    },
    {
      title: 'Developer Portals',
      description: 'Design information hierarchy for developers.',
      topics: ['Information Architecture', 'Developer onboarding guides', 'SDK code samples', 'FAQ templates'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🌐',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'Developer portal design UX', url: ytUrl('developer portal design UX docs') }],
      aiTip: 'Create Quick Start guides. Onboarding should lead developers to their first successful API response in under 5 minutes.',
      interviewQuestions: ['Onboarding guides structure?', 'Information architecture rules?', 'SDK samples format?']
    },
    {
      title: 'Documenting Code',
      description: 'Write inline comments and block tutorials.',
      topics: ['JSDoc / Javadoc formats', 'Readmes guidelines', 'Inline comments rules', 'Tutorial writing steps'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '💻',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Javadoc JSDoc code comments', url: ytUrl('code commenting JSDoc Javadoc tutorial') }],
      aiTip: 'Document "Why" code exists, rather than "What" it does. Let clean code explain the mechanics.',
      interviewQuestions: ['JSDoc syntax formatting?', 'Inline comments rules?', 'PR document requirements?']
    },
    {
      title: 'CI/CD Review pipelines',
      description: 'Integrate linters in document releases.',
      topics: ['Vale prose linter', 'GitHub Action doc checks', 'CI/CD spell check tools', 'PR review steps'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '⚙️',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Vale prose linter documentation', url: ytUrl('Vale prose linter documentation github action') }],
      aiTip: 'Vale checks grammar rules automatically on every PR, ensuring styling guide consistency.',
      interviewQuestions: ['Linter usage in prose?', 'Automated spell checks config?', 'Review loops documentation?']
    },
    {
      title: 'Capstone Portal Docs',
      description: 'Launch complete dev documentation for a project.',
      topics: ['Docusaurus portal deployed', 'OpenAPI files linked', 'Readme markdown guidelines', 'Vale linter checks passing'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Tech Writing Portfolio', url: ytUrl('technical writing portfolio project github') }],
      aiTip: 'Include sample code blocks in multiple languages (Python, JS) to make your API documentation highly accessible.',
      interviewQuestions: ['Walk me through your portal.', 'Information architecture choice?', 'Linter config details?']
    }
  ],
  'IT Operations': [
    {
      title: 'ITIL Framework',
      description: 'Understand service management and ticketing flows.',
      topics: ['ITIL v4 Service Value Chain', 'SLA & KPI monitoring', 'Incident & Problem tickets', 'Change Advisory Boards'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '⚙️',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'ITIL service management', url: ytUrl('ITIL foundations service management') }],
      aiTip: 'Incident tickets restore service immediately. Problem tickets investigate root causes to prevent recurrence.',
      interviewQuestions: ['Incident vs Problem tickets?', 'SLA vs OLA?', 'Change advisory board role?']
    },
    {
      title: 'IT Infrastructures',
      description: 'Manage databases, storage, datacenters.',
      topics: ['Data Center layouts', 'Server maintenance', 'Backup procedures', 'Network mapping configs'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🗄️',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Data Center operations', url: ytUrl('data center operations hardware server') }],
      aiTip: 'Implement the 3-2-1 backup rule: 3 copies of data, across 2 different media types, with 1 offsite copy.',
      interviewQuestions: ['3-2-1 backup rule?', 'Data center layouts components?', 'Server hardware repair steps?']
    },
    {
      title: 'Architecting Enterprise Systems',
      description: 'Learn TOGAF frameworks and integrations.',
      topics: ['Enterprise Architecture (TOGAF)', 'Business migration strategies', 'System integration patterns', 'Cost analysis'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      icon: '🏗️',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'TOGAF Enterprise Architecture', url: ytUrl('TOGAF enterprise architecture basics') }],
      aiTip: 'TOGAF helps align IT strategy with business goals, providing modular frameworks for architecture.',
      interviewQuestions: ['Describe TOGAF domains.', 'Business migration patterns?', 'Enterprise integrations?']
    },
    {
      title: 'IT Compliance',
      description: 'Learn security guidelines and audit regulations.',
      topics: ['ISO 27001 auditing', 'Disaster Recovery planning', 'Risk Matrix updating', 'Access control reviews'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      icon: '🔐',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'ISO 27001 disaster recovery', url: ytUrl('disaster recovery planning ISO 27001') }],
      aiTip: 'Test disaster recovery protocols annually. Ensure Recovery Time Objectives (RTO) align with SLA parameters.',
      interviewQuestions: ['Define RTO and RPO.', 'Disaster recovery steps?', 'ISO 27001 audit checks?']
    },
    {
      title: 'Vendor Procurement',
      description: 'Manage licenses and vendor relationships.',
      topics: ['SaaS contract metrics', 'Asset Management logs', 'Cost tracking formulas', 'Procurement steps'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '📋',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'IT Asset Management', url: ytUrl('IT asset management procurement licensing') }],
      aiTip: 'Audit software license logs frequently to detect unused developer accounts, reducing cloud spend.',
      interviewQuestions: ['Software Asset Management steps?', 'Audit licensing records.', 'Vendor contract checking?']
    },
    {
      title: 'Change Governance',
      description: 'Administer deployments and transport paths.',
      topics: ['CAB presentations', 'Rollback scripts verification', 'Release schedules coordination', 'Patch management'],
      duration: '2 Weeks',
      difficulty: 'Advanced',
      icon: '🔁',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Patch management CAB', url: ytUrl('patch management change advisory board') }],
      aiTip: 'Confirm rollback scripts work in staging before deploying production patches.',
      interviewQuestions: ['Rollback scripts verification steps?', 'CAB meeting goals?', 'Patch deployment schedules?']
    },
    {
      title: 'Capstone IT Architecture Proposal',
      description: 'Document enterprise topology and DR strategies.',
      topics: ['Enterprise Architecture map', 'DR Strategy document', 'SLA metrics configuration', 'Asset Audit register'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'IT Ops Proposal', url: ytUrl('IT operations architectural proposal') }],
      aiTip: 'A professional proposal details how security, DR, licensing, and IT support scales as the business grows.',
      interviewQuestions: ['Walk me through your proposal.', 'Explain your DR prioritization.', 'SLA metrics choice?']
    }
  ],
  'Freshers Track': [
    {
      title: 'CS & Code Basics',
      description: 'Learn variables, loops, arrays, algorithms.',
      topics: ['Variables & Types', 'Loops & Decisions', 'Arrays & Lists', 'Basic debugging', 'Scratch/Python coding'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '💻',
      color: '#6D4AFF',
      resources: [{ type: 'youtube', title: 'Computer science programming python', url: ytUrl('computer science programming python scratch') }],
      aiTip: 'Write simple scripts to automate tasks. Practice typing code daily to gain muscle memory.',
      interviewQuestions: ['What is a loop?', 'List vs Array?', 'Variable scope rules?']
    },
    {
      title: 'Git Version Control',
      description: 'Collaborate with developers using Git repositories.',
      topics: ['Git init & commits', 'Git push & pull', 'GitHub repositories', 'Pull Requests basics'],
      duration: '2 Weeks',
      difficulty: 'Beginner',
      icon: '🔀',
      color: '#00D4FF',
      resources: [{ type: 'youtube', title: 'Git for freshers', url: ytUrl('git commands github developer') }],
      aiTip: 'Make small, frequent commits with clear messages. It makes bugs easier to find.',
      interviewQuestions: ['What is Git?', 'How to create a branch?', 'Commit vs Push?']
    },
    {
      title: 'Core Stack Basics',
      description: 'Understand HTML, CSS, JavaScript or basic SQL.',
      topics: ['HTML structure tags', 'CSS styling layouts', 'JavaScript variable scopes', 'Simple SQL SELECT'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '📄',
      color: '#22C55E',
      resources: [{ type: 'youtube', title: 'HTML CSS JS databases', url: ytUrl('web development SQL basics') }],
      aiTip: 'Combine HTML layouts with simple JS scripts to build responsive interactive mock web pages.',
      interviewQuestions: ['What is CSS box model?', 'Select all records query?', 'JS function definitions?']
    },
    {
      title: 'Relational Database Queries',
      description: 'Query database tables and retrieve outputs.',
      topics: ['SQL SELECT FROM', 'WHERE filtering rules', 'ORDER BY sorting', 'Simple Joins syntax'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🗄️',
      color: '#FBBF24',
      resources: [{ type: 'youtube', title: 'SQL query database beginner', url: ytUrl('SQL select queries data') }],
      aiTip: 'Relational databases are everywhere. Learn to write clean joins to link data tables.',
      interviewQuestions: ['Query all records with conditions?', 'Join table inputs?', 'Sort output SQL syntax?']
    },
    {
      title: 'Resume & Interview Prep',
      description: 'Structure resumes for ATS screening bots.',
      topics: ['ATS keyword match rules', 'Projects description formatting', 'Behavioral interview questions', 'LinkedIn profile configuration'],
      duration: '2 Weeks',
      difficulty: 'Beginner',
      icon: '📄',
      color: '#F97316',
      resources: [{ type: 'youtube', title: 'Resume optimization ATS junior', url: ytUrl('junior developer resume ATS interview') }],
      aiTip: 'Avoid PDF templates with complex two-column structures. ATS scanners prefer simple single-column designs.',
      interviewQuestions: ['What is an ATS system?', 'Describe a project using STAR model.', 'Grow LinkedIn contacts?']
    },
    {
      title: 'Whiteboard Code Prep',
      description: 'Prepare for junior developer live coding tests.',
      topics: ['LeetCode easy problems', 'Reverse a string logic', 'Palindrome check function', 'FizzBuzz solutions'],
      duration: '3 Weeks',
      difficulty: 'Beginner',
      icon: '🧩',
      color: '#EF4444',
      resources: [{ type: 'youtube', title: 'Leetcode whiteboard prep junior', url: ytUrl('leetcode easy whiteboard prep junior') }],
      aiTip: 'Talk aloud while coding. Interviewers evaluate how you approach problems, not just the solution.',
      interviewQuestions: ['Solve FizzBuzz coding problem.', 'Check if string is palindrome.', 'Time complexity rules?']
    },
    {
      title: 'Portfolio Site Capstone',
      description: 'Host and deploy a profile showcasing your projects.',
      topics: ['GitHub Pages deployment', 'Projects description README', 'LinkedIn contact details', 'Clean code structure'],
      duration: '4 Weeks',
      difficulty: 'Expert',
      icon: '🏆',
      color: '#EC4899',
      resources: [{ type: 'project', title: 'Developer Portfolio Project', url: ytUrl('junior developer portfolio site project') }],
      aiTip: 'A live portfolio hosted on GitHub Pages or Vercel acts as proof of your coding capability.',
      interviewQuestions: ['Walk me through your portfolio projects.', 'Why choose this stack?', 'How did you host the site?']
    }
  ]
};

// Find category name by role mapping
export const getCategoryForRole = (role: string): { category: string; icon: string } => {
  for (const cat of ROLE_CATEGORIES) {
    if (cat.roles.includes(role)) {
      return { category: cat.category, icon: cat.icon };
    }
  }
  // Fallback heuristic keyword parsing
  const rLower = role.toLowerCase();
  if (rLower.includes('test') || rLower.includes('qa') || rLower.includes('quality') || rLower.includes('testing')) {
    return { category: 'Testing & QA', icon: '🧪' };
  }
  if (rLower.includes('security') || rLower.includes('cyber') || rLower.includes('hacker') || rLower.includes('soc')) {
    return { category: 'Cybersecurity', icon: '🔐' };
  }
  if (rLower.includes('data') || rLower.includes('db') || rLower.includes('sql') || rLower.includes('analytics') || rLower.includes('scientist')) {
    return { category: 'Database & Data', icon: '🗄️' };
  }
  if (rLower.includes('net') || rLower.includes('network') || rLower.includes('admin') || rLower.includes('infra') || rLower.includes('support')) {
    return { category: 'Networking & Infra', icon: '🌐' };
  }
  if (rLower.includes('cloud') || rLower.includes('platform') || rLower.includes('kubernetes') || rLower.includes('sre')) {
    return { category: 'Cloud & Platform', icon: '☁️' };
  }
  if (rLower.includes('sap') || rLower.includes('salesforce') || rLower.includes('oracle') || rLower.includes('crm') || rLower.includes('erp')) {
    return { category: 'ERP & Enterprise', icon: '🏢' };
  }
  if (rLower.includes('product') || rLower.includes('project') || rLower.includes('scrum') || rLower.includes('agile') || rLower.includes('business')) {
    return { category: 'Product & Business', icon: '📋' };
  }
  if (rLower.includes('design') || rLower.includes('ui') || rLower.includes('ux') || rLower.includes('designer') || rLower.includes('creative')) {
    return { category: 'UI/UX & Design', icon: '🎨' };
  }
  if (rLower.includes('ai') || rLower.includes('ml') || rLower.includes('nlp') || rLower.includes('vision') || rLower.includes('intelligence') || rLower.includes('robotic')) {
    return { category: 'AI & Emerging', icon: '🤖' };
  }
  if (rLower.includes('chain') || rLower.includes('web3') || rLower.includes('crypto') || rLower.includes('solidity') || rLower.includes('blockchain')) {
    return { category: 'Blockchain & Web3', icon: '⛓️' };
  }
  if (rLower.includes('write') || rLower.includes('writer') || rLower.includes('doc') || rLower.includes('documentation') || rLower.includes('spec')) {
    return { category: 'Technical Writing', icon: '✍️' };
  }
  if (rLower.includes('operation') || rLower.includes('manager') || rLower.includes('architect') || rLower.includes('consult')) {
    return { category: 'IT Operations', icon: '⚙️' };
  }
  if (rLower.includes('trainee') || rLower.includes('junior') || rLower.includes('associate') || rLower.includes('student')) {
    return { category: 'Freshers Track', icon: '🎓' };
  }
  return { category: 'Software Development', icon: '💻' };
};

// Builder function that returns static configurations OR dynamically builds a high-quality customized plan
export const buildRoadmap = (role: string): RoleRoadmap => {
  // If static definition exists, use it
  if (staticRoadmaps[role]) {
    return staticRoadmaps[role];
  }

  // Find category mapping
  const { category } = getCategoryForRole(role);
  
  // Use templates to build dynamically
  const stepTemplates = templates[category] || templates['Software Development'];

  // Map templates to dynamic steps
  const steps: RoadmapStep[] = stepTemplates.map((tpl, index) => {
    const id = index + 1;
    let status: StepStatus = 'locked';
    let progress = 0;
    
    // Step status defaults:
    if (id === 1) {
      status = 'completed';
      progress = 100;
    } else if (id === 2) {
      status = 'completed';
      progress = 100;
    } else if (id === 3) {
      status = 'in-progress';
      progress = 50;
    } else if (id === 4) {
      status = 'available';
      progress = 0;
    }

    // Dynamic replacement in text fields
    const title = tpl.title.replace('{role}', role);
    const description = tpl.description.replace('{role}', role);
    const topics = tpl.topics.map(t => t.replace('{role}', role));
    const aiTip = tpl.aiTip.replace('{role}', role);
    const interviewQuestions = tpl.interviewQuestions.map(q => q.replace('{role}', role));

    // Dynamic replacement in resources queries
    const resources: ResourceItem[] = tpl.resources.map(res => {
      let url = res.url;
      if (res.type === 'youtube' && !url) {
        url = ytUrl(`${role} ${res.title}`);
      } else if (!url) {
        url = ytUrl(`${role} tutorials`);
      }
      return {
        type: res.type,
        title: res.title.replace('{role}', role),
        url
      };
    });

    return {
      id,
      title,
      description,
      topics,
      duration: tpl.duration,
      difficulty: tpl.difficulty,
      status,
      progress,
      icon: tpl.icon,
      color: tpl.color,
      resources,
      aiTip,
      interviewQuestions
    };
  });

  return {
    role,
    description: `AI-Generated Roadmap to guide you on your journey towards becoming a successful ${role}.`,
    duration: '4–6 Months',
    level: 'Beginner → Professional',
    jobReadyScore: 75,
    completionPct: 35,
    steps
  };
};
