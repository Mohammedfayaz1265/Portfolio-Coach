export interface ImproveTextOptions {
  text: string;
  fieldName?: string;
  tone?: 'simple' | 'professional' | 'technical';
  length?: 'short' | 'detailed';
  context?: Record<string, any>;
}

export interface ImproveTextResult {
  improved: string;
  source: string;
  notice: string;
}

export interface HeadlineSuggestionOptions {
  name?: string;
  situation?: string;
  goal?: string;
  targetRole?: string;
  skills?: string[];
  topProject?: string;
}

export interface ProjectSummaryOptions {
  projectName: string;
  whatItDoes: string;
  problem?: string;
  contribution?: string;
  techStack?: string[];
  status?: string;
  tone?: 'simple' | 'professional' | 'technical';
  length?: 'short' | 'detailed';
}

export interface ProjectSummaryResult {
  summary: string;
  bullets: string[];
  source: string;
}

export async function improveText(options: ImproveTextOptions): Promise<ImproveTextResult> {
  try {
    const res = await fetch('/api/ai/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      improved: data.improved || options.text,
      source: data.source || 'gemini',
      notice: data.notice || 'AI-generated content should be reviewed before publishing.',
    };
  } catch (err) {
    // Client-side graceful fallback
    const trimmed = options.text.trim();
    let fallback = trimmed;
    if (options.tone === 'technical') {
      fallback = `${trimmed} Executed key objectives utilizing systematic development practices.`;
    } else if (options.length === 'detailed') {
      fallback = `${trimmed} Actively focused on practical execution, problem solving, and clear outcomes.`;
    }

    return {
      improved: fallback,
      source: 'local_offline',
      notice: 'Reviewed using local template (writing assistant offline fallback).',
    };
  }
}

export async function suggestHeadlines(options: HeadlineSuggestionOptions): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/suggest-headlines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.headlines) && data.headlines.length > 0) {
      return data.headlines;
    }
  } catch (e) {
    // Fallback
  }

  const role = options.targetRole || 'Software Development';
  const skillsList = options.skills && options.skills.length > 0 ? options.skills.slice(0, 3).join(' • ') : 'Hands-on Projects';
  return [
    `${role} Enthusiast | Focused on Practical Problem Solving & Growth`,
    `Student & Aspiring Builder | ${skillsList}`,
    `Dedicated Learner | Building Impactful Software & Collaborative Tools`,
  ];
}

export async function generateProjectSummary(options: ProjectSummaryOptions): Promise<ProjectSummaryResult> {
  try {
    const res = await fetch('/api/ai/project-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      summary: data.summary || `${options.projectName}: ${options.whatItDoes}`,
      bullets: Array.isArray(data.bullets) && data.bullets.length > 0
        ? data.bullets
        : [`Developed ${options.projectName} to address ${options.problem || 'user needs'}.`],
      source: data.source || 'gemini',
    };
  } catch (err) {
    return {
      summary: `${options.projectName} is a project designed to ${options.whatItDoes.toLowerCase().startsWith('to') ? options.whatItDoes.slice(3) : options.whatItDoes}.`,
      bullets: [
        `Built ${options.projectName} to resolve: ${options.problem || 'core workflow challenges'}.`,
        options.contribution ? `Contributed: ${options.contribution}` : 'Implemented key front-end and application logic.',
        options.techStack && options.techStack.length > 0 ? `Built with ${options.techStack.join(', ')}.` : 'Utilized modern modular architecture.',
      ],
      source: 'local_offline',
    };
  }
}

export interface ElaborationSuggestion {
  category: string;
  question: string;
  samplePrompt: string;
}

export interface ElaborationResult {
  suggestions: ElaborationSuggestion[];
  missingAngles: string[];
  elaborationTip: string;
  source: string;
}

export async function suggestElaborationPrompts(
  section: 'projects' | 'experience',
  data: Record<string, any>
): Promise<ElaborationResult> {
  try {
    const res = await fetch('/api/ai/suggest-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return {
      suggestions: Array.isArray(json.suggestions) ? json.suggestions : [],
      missingAngles: Array.isArray(json.missingAngles) ? json.missingAngles : [],
      elaborationTip: json.elaborationTip || 'Elaborate on your personal role and key outcomes.',
      source: json.source || 'gemini',
    };
  } catch (err) {
    const defaultSuggestions: ElaborationSuggestion[] =
      section === 'projects'
        ? [
            {
              category: 'Technical Challenges',
              question: 'What was the toughest bug, architectural hurdle, or edge case you encountered while building this?',
              samplePrompt: 'e.g. Handled async state race conditions during data fetching.',
            },
            {
              category: 'Specific Contribution',
              question: 'Which specific logic or user interface components did you write individually?',
              samplePrompt: 'e.g. Architected the responsive grid and integrated the local storage cache.',
            },
            {
              category: 'User Verification',
              question: 'Did peers, classmates, or instructors test or review this project?',
              samplePrompt: 'e.g. Gathered feedback from 15 classmates to refine navigation.',
            },
          ]
        : [
            {
              category: 'Measurable Outcomes',
              question: 'Can you mention a concrete output, number of students assisted, or event organized?',
              samplePrompt: 'e.g. Mentored 35+ students in weekly laboratory sessions.',
            },
            {
              category: 'Key Responsibilities',
              question: 'What processes or tools did you actively use to deliver your responsibilities?',
              samplePrompt: 'e.g. Documented standard operating procedures and code review rubrics.',
            },
          ];

    return {
      suggestions: defaultSuggestions,
      missingAngles: ['Specific contribution', 'Technical hurdles'],
      elaborationTip: 'Highlight your specific role, technical tools, and problem-solving process.',
      source: 'local_offline',
    };
  }
}
