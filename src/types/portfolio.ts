export type SituationType =
  | 'school_student'
  | 'college_student'
  | 'recent_grad'
  | 'professional'
  | 'creator'
  | 'other';

export type GoalType =
  | 'internship'
  | 'job'
  | 'college_projects'
  | 'freelance'
  | 'grad_school'
  | 'creative'
  | 'brand';

export type BackgroundItem =
  | 'academic_projects'
  | 'internship'
  | 'coursework'
  | 'certificates'
  | 'creative_work'
  | 'hackathons'
  | 'volunteering'
  | 'research'
  | 'just_started';

export type PortfolioStyle = 'professional' | 'creative' | 'minimal';

export interface OnboardingState {
  completed: boolean;
  step: number; // 1 to 4
  situation: SituationType;
  goal: GoalType;
  background: BackgroundItem[];
  preferredStyle: PortfolioStyle;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
  dribbble?: string;
  email?: string;
}

export interface PersonalProfile {
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  email: string;
  careerInterests: string[];
  socialLinks: SocialLinks;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade?: string;
  coursework?: string[];
}

export type ExperienceType =
  | 'full_time'
  | 'part_time'
  | 'internship'
  | 'freelance'
  | 'contract'
  | 'apprenticeship'
  | 'campus_ambassador'
  | 'volunteering'
  | 'research'
  | 'leadership';

export interface ExperienceItem {
  id: string;
  type: ExperienceType;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
  contributions: string;
  outcomes: string;
  link?: string;
}

export type ProjectStatus = 'idea' | 'prototype' | 'in_progress' | 'completed';

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  targetAudience: string;
  personalContribution: string;
  isTeam: boolean;
  techStack: string[];
  workingFeatures: string[];
  challenges?: string;
  learnings?: string;
  status: ProjectStatus;
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export type SkillStage = 'learning' | 'practicing' | 'demonstrated';

export interface SkillItem {
  name: string;
  stage: SkillStage;
}

export interface SkillCategories {
  programming: SkillItem[];
  tools: SkillItem[];
  analytical: SkillItem[];
  communication: SkillItem[];
  creative: SkillItem[];
  languages: SkillItem[];
}

export type CertificateCategory = 'course' | 'participation' | 'award' | 'credential';

export interface CertificateAttachment {
  name: string;
  size: string;
  type: string;
  dataUrl: string;
  isImage?: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category: CertificateCategory;
  description: string;
  verificationUrl?: string;
  attachment?: CertificateAttachment;
}

export type ActivityCategory = 'leadership' | 'club' | 'volunteering' | 'creative' | 'competition' | 'research';

export interface ActivityItem {
  id: string;
  category: ActivityCategory;
  title: string;
  organization: string;
  period: string;
  description: string;
  link?: string;
}

export type SectionId =
  | 'intro'
  | 'projects'
  | 'skills'
  | 'education'
  | 'experience'
  | 'certificates'
  | 'activities'
  | 'contact';

export interface SectionConfig {
  id: SectionId;
  label: string;
  visible: boolean;
  order: number;
}

export interface PortfolioData {
  onboarding: OnboardingState;
  profile: PersonalProfile;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategories;
  certificates: CertificateItem[];
  activities: ActivityItem[];
  sections: SectionConfig[];
  template: PortfolioStyle;
  accentColor: string;
  lastSaved: string;
}
