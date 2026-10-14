import { PortfolioData, SectionConfig } from '../types/portfolio';

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'intro', label: 'My Introduction', visible: true, order: 0 },
  { id: 'projects', label: 'My Projects', visible: true, order: 1 },
  { id: 'skills', label: 'My Skills', visible: true, order: 2 },
  { id: 'education', label: 'My Education', visible: true, order: 3 },
  { id: 'experience', label: 'My Experience', visible: true, order: 4 },
  { id: 'certificates', label: 'My Certificates', visible: true, order: 5 },
  { id: 'activities', label: 'My Activities', visible: true, order: 6 },
  { id: 'contact', label: 'My Contact Details', visible: true, order: 7 },
];

export const EMPTY_PORTFOLIO: PortfolioData = {
  onboarding: {
    completed: false,
    step: 1,
    situation: 'college_student',
    goal: 'internship',
    background: ['academic_projects', 'coursework'],
    preferredStyle: 'professional',
  },
  profile: {
    fullName: '',
    headline: '',
    bio: '',
    avatarUrl: '',
    location: '',
    email: '',
    careerInterests: [],
    socialLinks: {},
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    programming: [],
    tools: [],
    analytical: [],
    communication: [],
    creative: [],
    languages: [],
  },
  certificates: [],
  activities: [],
  sections: DEFAULT_SECTIONS,
  template: 'professional',
  accentColor: '#4f46e5',
  lastSaved: new Date().toISOString(),
};

export const SAMPLE_STUDENT_PORTFOLIO: PortfolioData = {
  onboarding: {
    completed: true,
    step: 4,
    situation: 'college_student',
    goal: 'internship',
    background: ['academic_projects', 'coursework', 'volunteering'],
    preferredStyle: 'professional',
  },
  profile: {
    fullName: 'Maya Chen',
    headline: 'Computer Science Undergraduate | Passionate about Accessible Web Tools & Human-Centered Design',
    bio: 'Third-year student at the University of Washington with a strong foundation in data structures, web systems, and collaborative development. Excited to build dependable, accessible software and seeking a summer 2027 software engineering internship.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    location: 'Seattle, WA',
    email: 'maya.chen.work@gmail.com',
    careerInterests: ['Frontend Engineering', 'Full-Stack Development', 'Accessible Web Design'],
    socialLinks: {
      github: 'https://github.com/mayachen-dev',
      linkedin: 'https://linkedin.com/in/mayachen-demo',
      website: 'https://mayachen.me',
    },
  },
  education: [
    {
      id: 'edu-1',
      institution: 'University of Washington',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Software Engineering',
      startYear: '2023',
      endYear: '2027 (Expected)',
      grade: '3.82 GPA',
      coursework: [
        'Data Structures & Algorithms',
        'Web Systems Architecture',
        'Database Management',
        'User Experience Design',
        'Computer Systems Programming',
      ],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      type: 'internship',
      organization: 'CivicTech Seattle (University Capstone Lab)',
      role: 'Web Development Fellow',
      startDate: 'Jun 2024',
      endDate: 'Aug 2024',
      isCurrent: false,
      responsibilities: 'Collaborated in a team of 4 student developers to build an open-source neighborhood transit dashboard.',
      contributions: 'Implemented accessible filter components in React, audited contrast for WCAG AA compliance, and authored end-to-end user testing guides.',
      outcomes: 'Helped deliver the v1 prototype tested by over 120 community transit riders during summer beta tests.',
      link: 'https://github.com/example/civic-transit',
    },
    {
      id: 'exp-2',
      type: 'campus_ambassador',
      organization: 'UW Department of Computer Science',
      role: 'Peer Tutor & Lab Assistant',
      startDate: 'Sep 2024',
      endDate: 'Present',
      isCurrent: true,
      responsibilities: 'Assist first-year students during weekly programming laboratory sessions.',
      contributions: 'Mentored 35+ students in debugging Python and Java code and mastering recursion concepts.',
      outcomes: 'Organized 3 mid-term review workshops with high student satisfaction feedback.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'StudySync — Peer Study Group Matcher',
      tagline: 'A lightweight web app helping university students form peer study groups by course schedule.',
      description: 'Built as a semester project to solve the challenge of finding study partners in large 400-student introductory science lectures. Matches students based on mutually available class break hours and target exam topics.',
      problem: 'Students in large lecture halls often struggle to find motivated peers with matching availability.',
      targetAudience: 'University undergraduates enrolled in multi-section courses.',
      personalContribution: 'Led front-end interface design, created time-slot calendar picker, and integrated client-side state management with local validation.',
      isTeam: true,
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      workingFeatures: [
        'Interactive weekly schedule grid with conflict detection',
        'Course-based peer search and instant invite generation',
        'Export group meeting times to Google Calendar ICS',
      ],
      challenges: 'Handling overlapping calendar slots across distinct time zones and irregular lecture schedules.',
      learnings: 'Deepened practical knowledge of responsive CSS grid layouts and state normalization.',
      status: 'completed',
      demoUrl: 'https://studysync-demo.web.app',
      githubUrl: 'https://github.com/mayachen-dev/studysync',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'CampusWasteLens — Mobile Web Classifier',
      tagline: 'An accessible browser tool guiding students on sorting recycling and compost correctly.',
      description: 'Developed during HackUW 2024. Uses camera capture and lightweight browser classification to suggest whether items belong in compost, mixed recycling, or landfill bins under municipal guidelines.',
      problem: 'High contamination rates in campus recycling bins due to confusing packaging labeling.',
      targetAudience: 'University campus residents and dining hall visitors.',
      personalContribution: 'Built the responsive mobile-first UI, camera stream capture modal, and educational recycling tips drawer.',
      isTeam: true,
      techStack: ['React', 'TypeScript', 'MediaDevices API', 'Tailwind CSS'],
      workingFeatures: [
        'Real-time webcam image capture in mobile browser',
        'Instant bin recommendation with clear contamination warnings',
        'Offline searchable directory of 150+ common dining items',
      ],
      challenges: 'Ensuring fast load times on spotty campus Wi-Fi and handling browser camera permissions gracefully.',
      learnings: 'Learned progressive web design patterns and accessible screen reader notifications.',
      status: 'completed',
      demoUrl: 'https://wastelens-demo.web.app',
      githubUrl: 'https://github.com/mayachen-dev/wastelens',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
  ],
  skills: {
    programming: [
      { name: 'TypeScript / JavaScript', stage: 'demonstrated' },
      { name: 'Python', stage: 'demonstrated' },
      { name: 'Java', stage: 'practicing' },
      { name: 'HTML5 & CSS3', stage: 'demonstrated' },
      { name: 'SQL Basics', stage: 'learning' },
    ],
    tools: [
      { name: 'Git & GitHub', stage: 'demonstrated' },
      { name: 'VS Code', stage: 'demonstrated' },
      { name: 'Figma (UI Wireframing)', stage: 'practicing' },
      { name: 'Postman', stage: 'learning' },
    ],
    analytical: [
      { name: 'Algorithm Analysis', stage: 'practicing' },
      { name: 'Debugging & Unit Testing', stage: 'demonstrated' },
      { name: 'Requirement Breakdown', stage: 'demonstrated' },
    ],
    communication: [
      { name: 'Technical Documentation', stage: 'demonstrated' },
      { name: 'Peer Mentoring', stage: 'demonstrated' },
      { name: 'Cross-functional Collaboration', stage: 'practicing' },
    ],
    creative: [
      { name: 'Accessible Web Layouts', stage: 'demonstrated' },
      { name: 'Design Systems', stage: 'practicing' },
    ],
    languages: [
      { name: 'English (Fluent)', stage: 'demonstrated' },
      { name: 'Mandarin (Conversational)', stage: 'practicing' },
    ],
  },
  certificates: [
    {
      id: 'cert-1',
      title: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      issueDate: 'Mar 2024',
      category: 'course',
      description: 'Completed 300 hours of coursework covering modern HTML5, CSS Flexbox/Grid, and responsive design fundamentals.',
      verificationUrl: 'https://freecodecamp.org/certification/example',
    },
    {
      id: 'cert-2',
      title: 'Top Sustainability Project Award',
      issuer: 'HackUW 2024',
      issueDate: 'Oct 2024',
      category: 'award',
      description: 'Awarded 2nd Place in the Environmental Impact track for the CampusWasteLens project among 45 student submissions.',
    },
  ],
  activities: [
    {
      id: 'act-1',
      category: 'leadership',
      title: 'Vice President of Logistics',
      organization: 'Women in Computer Science (WiCS) Student Chapter',
      period: 'Jan 2024 — Present',
      description: 'Coordinated logistics for monthly technical workshops, company speaker panels, and a 60-person coding study jam.',
      link: 'https://wics.cs.washington.edu',
    },
    {
      id: 'act-2',
      category: 'volunteering',
      title: 'Volunteer Instructor',
      organization: 'CoderDojo Youth Seattle',
      period: '2023 — 2024',
      description: 'Guided middle school students through building their first interactive games with Scratch and basic web pages.',
    },
  ],
  sections: DEFAULT_SECTIONS,
  template: 'professional',
  accentColor: '#4f46e5',
  lastSaved: new Date().toISOString(),
};

const STORAGE_KEY = 'portfolia_app_data_v1';

export function loadSavedPortfolio(): PortfolioData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.warn('Failed to parse saved portfolio from storage:', e);
    return null;
  }
}

export function savePortfolioToStorage(data: PortfolioData): void {
  try {
    const updated = { ...data, lastSaved: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save portfolio to storage:', e);
  }
}

export function clearPortfolioStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear storage:', e);
  }
}
