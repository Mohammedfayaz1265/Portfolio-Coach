import { PortfolioData } from '../types/portfolio';

export interface CoachSuggestion {
  id: string;
  title: string;
  description: string;
  targetSection: string;
  actionText: string;
  priority: 'high' | 'medium' | 'low';
}

export function evaluatePortfolioCompleteness(data: PortfolioData): CoachSuggestion[] {
  const suggestions: CoachSuggestion[] = [];

  // Check 1: Personal profile & headline
  if (!data.profile.fullName || !data.profile.headline) {
    suggestions.push({
      id: 'profile_basics',
      title: 'Add your name & professional headline',
      description: 'A clear headline helps visitors immediately understand what you are studying or working toward.',
      targetSection: 'intro',
      actionText: 'Complete Introduction',
      priority: 'high',
    });
  } else if (!data.profile.bio || data.profile.bio.length < 40) {
    suggestions.push({
      id: 'profile_bio',
      title: 'Add a 2-3 sentence introduction',
      description: 'Introduce your background, what topics excite you, and what kind of role or collaboration you are seeking.',
      targetSection: 'intro',
      actionText: 'Polish Bio',
      priority: 'high',
    });
  }

  // Check 2: Projects
  if (data.projects.length === 0) {
    suggestions.push({
      id: 'add_first_project',
      title: 'Showcase your first project',
      description: 'Even small class projects, coursework builds, or hackathon experiments make your portfolio come alive.',
      targetSection: 'projects',
      actionText: 'Add a Project',
      priority: 'high',
    });
  } else {
    // Check if project has contribution or links
    const projectNeedingContribution = data.projects.find(p => !p.personalContribution || p.personalContribution.length < 15);
    if (projectNeedingContribution) {
      suggestions.push({
        id: 'project_contribution',
        title: `Clarify your role in "${projectNeedingContribution.title}"`,
        description: 'Recruiters and professors love knowing what you specifically built or solved.',
        targetSection: 'projects',
        actionText: 'Specify Contribution',
        priority: 'high',
      });
    }

    const projectNeedingLink = data.projects.find(p => !p.demoUrl && !p.githubUrl);
    if (projectNeedingLink) {
      suggestions.push({
        id: 'project_link',
        title: `Add a link or repository to "${projectNeedingLink.title}"`,
        description: 'Adding a link to a demo or code repository allows viewers to verify your work firsthand.',
        targetSection: 'projects',
        actionText: 'Add Link',
        priority: 'medium',
      });
    }
  }

  // Check 3: Skills
  const totalSkills = Object.values(data.skills).reduce((acc, cat) => acc + cat.length, 0);
  if (totalSkills < 3) {
    suggestions.push({
      id: 'add_skills',
      title: 'List 3-5 core tools or skills you are learning',
      description: 'Categorize your skills and mark whether you are actively practicing or have demonstrated them.',
      targetSection: 'skills',
      actionText: 'Add Skills',
      priority: 'medium',
    });
  }

  // Check 4: Education coursework
  if (data.education.length > 0) {
    const eduWithoutCourses = data.education.find(e => !e.coursework || e.coursework.length === 0);
    if (eduWithoutCourses) {
      suggestions.push({
        id: 'add_coursework',
        title: 'Include 2-4 relevant courses in your Education',
        description: 'Highlighting courses like Algorithms, UX Design, or Lab Sciences shows your academic foundation.',
        targetSection: 'education',
        actionText: 'Add Coursework',
        priority: 'medium',
      });
    }
  } else {
    suggestions.push({
      id: 'add_education',
      title: 'Add your school or university',
      description: 'Share where you are studying or recently graduated from, along with your major.',
      targetSection: 'education',
      actionText: 'Add Education',
      priority: 'high',
    });
  }

  // Check 5: Contact links
  if (!data.profile.email && !data.profile.socialLinks.linkedin && !data.profile.socialLinks.github) {
    suggestions.push({
      id: 'add_contact',
      title: 'Provide a way for recruiters to contact you',
      description: 'Add an email address or link your LinkedIn / GitHub so people can reach out with opportunities.',
      targetSection: 'contact',
      actionText: 'Add Contact Details',
      priority: 'high',
    });
  }

  // Check 6: Goal-specific improvements
  if (data.onboarding.goal === 'internship' && data.experience.length === 0 && data.activities.length === 0) {
    suggestions.push({
      id: 'add_activities_for_internship',
      title: 'Add student clubs, leadership, or volunteering',
      description: 'Extracurricular activities, hackathons, or campus clubs demonstrate teamwork even before your first internship.',
      targetSection: 'activities',
      actionText: 'Add Activity',
      priority: 'medium',
    });
  }

  // Sort by priority and return top 3 actionable suggestions
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions.slice(0, 3);
}
