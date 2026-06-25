import { Template, TemplateId, ResumeData, SubscriptionTier } from '@/types/hydranhunt';

export const COLORS = {
  blue: '#0000FF',
  amber: '#FFBF00',
  lime: '#BEF754',
  magenta: '#FF00FF',
  cyan: '#00FFFF',
  gray: '#DCDFD5',
  black: '#000000',
  white: '#FFFFFF',
  darkGray: '#111111'
};

export const TEMPLATES: Template[] = [
  {
    id: TemplateId.CYBER,
    name: 'Cyber Funk',
    description: 'Bold, geometric, and high contrast.',
    colors: [COLORS.magenta, COLORS.cyan],
  },
  {
    id: TemplateId.MINIMAL,
    name: 'Neo Clean',
    description: 'Structured simplicity with a pop.',
    colors: [COLORS.black, COLORS.lime],
  },
  {
    id: TemplateId.BOLD,
    name: 'Executive Pop',
    description: 'Professional layout with vibrant headers.',
    colors: [COLORS.blue, COLORS.amber],
  },
  {
    id: TemplateId.TERMINAL,
    name: 'Mainframe',
    description: 'Hacker aesthetic. Monospace. Raw.',
    colors: [COLORS.black, '#00FF00'],
  },
  {
    id: TemplateId.BRUTALIST,
    name: 'Brutalist',
    description: 'Raw, unpolished, effective.',
    colors: [COLORS.white, COLORS.black],
  },
  {
    id: TemplateId.NEON,
    name: 'Night City',
    description: 'Dark mode with glowing accents.',
    colors: [COLORS.darkGray, COLORS.cyan],
  },
  {
    id: TemplateId.QUANTUM,
    name: 'Quantum',
    description: 'Scientific precision and clean lines.',
    colors: [COLORS.white, COLORS.blue],
  },
  {
    id: TemplateId.GRID,
    name: 'The Grid',
    description: 'Highly structured data visualization.',
    colors: [COLORS.gray, COLORS.black],
  },
  {
    id: TemplateId.SWISS,
    name: 'Helvetica',
    description: 'Asymmetrical typography focus.',
    colors: [COLORS.white, COLORS.magenta],
  },
];

export const MOCK_RESUME: ResumeData = {
  id: '1',
  userId: 'mock-user',
  title: 'Senior Developer Resume',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentVersion: {
    id: 'v1',
    resumeId: '1',
    versionNumber: 1,
    title: 'Default',
    isCurrent: true,
    fullName: 'Alex "Vibe" Coder',
    email: 'alex@vibecoding.com',
    phone: '+1 (555) 019-2834',
    location: 'Neo Tokyo, Internet',
    website: 'vibecoding.com',
    summary: 'Passionate Full Stack Engineer specializing in building futuristic user interfaces and robust backend systems. Obsessed with clean code and neon colors.',
    templateId: TemplateId.CYBER,
    lethalityScore: 85,
    atsScore: 78,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    experience: [
      {
        id: 'e1',
        company: 'Future Corp',
        title: 'Lead Architect',
        startDate: '2022-01',
        endDate: 'Present',
        description: 'Leading the migration to a cyber-enhanced microservices architecture. Improved system velocity by 300%.',
        order: 0,
      },
      {
        id: 'e2',
        company: 'Retro Systems',
        title: 'Frontend Dev',
        startDate: '2019-05',
        endDate: '2021-12',
        description: 'Built the first ever retro-wave dashboard for monitoring server health.',
        order: 1,
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'University of Digital Arts',
        degree: 'B.S. Computer Science',
        field: 'Computer Science',
        endDate: '2019',
        order: 0,
      },
    ],
    skills: [
      { id: 's1', name: 'React', category: 'Frontend', level: 5, order: 0 },
      { id: 's2', name: 'TypeScript', category: 'Frontend', level: 5, order: 1 },
      { id: 's3', name: 'Node.js', category: 'Backend', level: 4, order: 2 },
      { id: 's4', name: 'Cyber Security', category: 'Security', level: 3, order: 3 },
    ],
  },
};

export const SUBSCRIPTION_LIMITS = {
  [SubscriptionTier.SCOUT]: {
    maxResumes: 1,
    autoStrikes: 0,
    features: ['basic_templates', 'resume_forge'],
  },
  [SubscriptionTier.HUNTER]: {
    maxResumes: -1,
    autoStrikes: 30,
    features: ['unlimited_resumes', 'strike_analysis', 'ai_editing', 'auto_hunt'],
  },
  [SubscriptionTier.HYDRA]: {
    maxResumes: -1,
    autoStrikes: -1,
    features: ['unlimited_resumes', 'strike_analysis', 'ai_editing', 'unlimited_auto_hunt', 'career_mapping', 'priority_queue'],
  },
};
