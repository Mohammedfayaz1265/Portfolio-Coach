import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Setup Google GenAI with recommended telemetry
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('GoogleGenAI initialization warning:', err);
  }
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasAiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
  });
});

const HONESTY_INSTRUCTIONS = `
CRITICAL HONESTY RULES:
- Never invent qualifications, jobs, internships, project features, awards, skills, metrics or results.
- Never describe a prototype as a fully launched production product.
- Never claim a team accomplishment as solely the user's work.
- Do not convert mere participation or coursework into competition winning.
- If information is missing, omit the detail or phrase it honestly around what the user actually provided.
- Do not return conversational pleasantries or markdown formatting like backticks unless asked. Return plain text or clean bullet points directly.
`;

// Helper for local template fallbacks when AI is unavailable or offline
function localImproveText(text: string, tone: string, length: string): string {
  const cleaned = text.trim();
  if (!cleaned) return '';

  const sentences = cleaned.split(/(?<=[.?!])\s+/).filter(Boolean);
  const capitalized = sentences.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  if (tone === 'technical') {
    return length === 'short'
      ? capitalized
      : `${capitalized} Utilized technical problem-solving approaches to execute objectives and refine technical workflows.`;
  }
  if (tone === 'simple') {
    return capitalized;
  }
  // Professional default
  return length === 'short'
    ? capitalized
    : `${capitalized} Focused on continuous learning, clear execution, and delivering structured outcomes.`;
}

// API: Polish / improve text
app.post('/api/ai/improve', async (req: Request, res: Response) => {
  const { text, fieldName = 'content', tone = 'professional', length = 'short', context = {} } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Text content is required' });
    return;
  }

  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Graceful local fallback
    const improved = localImproveText(text, tone, length);
    res.json({
      improved,
      source: 'local_template',
      notice: 'Reviewed using Portfolia local writing patterns. Connect Gemini API key for deep AI rewrites.',
    });
    return;
  }

  try {
    const prompt = `
You are Portfolia's Writing Coach for students and job seekers.
Task: Improve and polish this user-provided text for the "${fieldName}" section.

User's original text:
"${text}"

Target tone: ${tone} (e.g. simple and natural, professional, or technical).
Target length: ${length} (e.g. concise short summary or detailed structured points).
User context: ${JSON.stringify(context)}

${HONESTY_INSTRUCTIONS}

Return ONLY the polished replacement text.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const result = response.text ? response.text.trim() : localImproveText(text, tone, length);

    res.json({
      improved: result,
      source: 'gemini',
      notice: 'AI-generated content should be reviewed for accuracy before publishing.',
    });
  } catch (error: any) {
    console.error('Gemini improvement error:', error?.message || error);
    // Provide clean fallback on API errors
    res.json({
      improved: localImproveText(text, tone, length),
      source: 'local_fallback',
      notice: 'Generated using local template (Gemini API temporarily unavailable).',
    });
  }
});

// API: Suggest headlines
app.post('/api/ai/suggest-headlines', async (req: Request, res: Response) => {
  const { name = '', situation = 'student', goal = 'internship', targetRole = '', skills = [], topProject = '' } = req.body;

  const fallbackHeadlines = [
    targetRole ? `${targetRole} | Focused on Hands-on Projects & Growth` : 'Aspiring Developer & Student | Building Practical Projects',
    `${situation === 'student' ? 'Student' : 'Learner'} | Passionate about Problem-Solving & Development`,
    skills.length ? `${skills.slice(0, 3).join(' • ')} Enthusiast | Seeking Opportunities` : 'Eager to Learn, Build, and Contribute',
  ];

  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.json({ headlines: fallbackHeadlines, source: 'local' });
    return;
  }

  try {
    const prompt = `
Generate 3 realistic, honest professional headlines for a student portfolio.
User Profile:
- Name: ${name || 'Student'}
- Current situation: ${situation}
- Main goal: ${goal}
- Target role/interest: ${targetRole || 'Not specified'}
- Key skills: ${Array.isArray(skills) ? skills.join(', ') : ''}
- Notable project: ${topProject || 'Academic projects'}

${HONESTY_INSTRUCTIONS}
Do not invent seniority like "Senior", "Lead", or "Expert". Keep it genuine and inspiring (e.g. "Computer Science Undergraduate | Passionate about Full-Stack Systems").

Respond in JSON array format: ["Headline 1", "Headline 2", "Headline 3"]
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          res.json({ headlines: parsed, source: 'gemini' });
          return;
        }
      } catch (e) {
        // Fall through
      }
    }
    res.json({ headlines: fallbackHeadlines, source: 'fallback' });
  } catch (err: any) {
    console.error('Headlines error:', err?.message || err);
    res.json({ headlines: fallbackHeadlines, source: 'local_fallback' });
  }
});

// API: Project summary & bullet points
app.post('/api/ai/project-summary', async (req: Request, res: Response) => {
  const {
    projectName,
    whatItDoes,
    problem,
    contribution,
    techStack,
    status = 'completed',
    tone = 'professional',
    length = 'detailed',
  } = req.body;

  const defaultBullet = whatItDoes ? `Built ${projectName || 'project'}: ${whatItDoes}` : 'Developed key functionality and user flows.';

  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.json({
      summary: `${projectName || 'Project'} is designed to address ${problem || 'user needs'} by ${whatItDoes || 'providing practical tools'}.`,
      bullets: [
        defaultBullet,
        contribution ? `Personally contributed: ${contribution}` : 'Implemented responsive front-end and core logic.',
        techStack ? `Built using ${Array.isArray(techStack) ? techStack.join(', ') : techStack}.` : 'Employed modern development tooling.',
      ],
      source: 'local',
    });
    return;
  }

  try {
    const prompt = `
Generate a concise project overview and 3 honest bullet points for this student portfolio project.
Project details:
- Project Name: ${projectName}
- What does it do: ${whatItDoes}
- Problem it addresses: ${problem}
- User's personal contribution: ${contribution}
- Technologies used: ${Array.isArray(techStack) ? techStack.join(', ') : techStack}
- Project Status: ${status} (e.g. idea, prototype, in progress, completed)
- Tone: ${tone}
- Length: ${length}

${HONESTY_INSTRUCTIONS}
Strictly ensure that if it is a prototype or in progress, it is described accurately as a prototype/WIP, never as a production platform with active paying users.

Return JSON format:
{
  "summary": "1-2 sentence honest summary of the project and purpose",
  "bullets": [
    "Action-oriented bullet point 1",
    "Action-oriented bullet point 2",
    "Action-oriented bullet point 3"
  ]
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        res.json({ ...parsed, source: 'gemini' });
        return;
      } catch (e) {
        // fallback
      }
    }

    res.json({
      summary: `${projectName}: ${whatItDoes}`,
      bullets: [defaultBullet],
      source: 'local',
    });
  } catch (err: any) {
    console.error('Project summary error:', err?.message || err);
    res.json({
      summary: `${projectName || 'Project'}: ${whatItDoes || 'Student portfolio project'}`,
      bullets: [defaultBullet],
      source: 'local_fallback',
    });
  }
});

// API: Content suggestions & elaboration prompts for Projects and Experience
app.post('/api/ai/suggest-prompts', async (req: Request, res: Response) => {
  const { section = 'projects', data = {} } = req.body;

  const fallbackSuggestions =
    section === 'projects'
      ? [
          {
            category: 'Personal Contribution',
            question: 'What specific modules, components, or logic did YOU author versus teammates or libraries?',
            samplePrompt: 'e.g. Personally designed the REST schema and built the client-side state caching layer.',
          },
          {
            category: 'Technical Challenges',
            question: 'What was the toughest bug, architectural hurdle, or edge case you encountered?',
            samplePrompt: 'e.g. Overcame async race conditions in API polling by debouncing search queries.',
          },
          {
            category: 'Key Learnings',
            question: 'What new library, pattern, or testing concept did this project teach you?',
            samplePrompt: 'e.g. Gained deep understanding of component lifecycle and responsive grid layout.',
          },
        ]
      : [
          {
            category: 'Measurable Outcomes',
            question: 'What concrete impact did your contributions have on the team, users, or organization?',
            samplePrompt: 'e.g. Guided 35+ first-year students and reduced lab queue wait times.',
          },
          {
            category: 'Collaboration & Tools',
            question: 'How did you communicate with stakeholders, mentors, or peers during this role?',
            samplePrompt: 'e.g. Participated in weekly standups and wrote comprehensive troubleshooting docs.',
          },
        ];

  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.json({
      suggestions: fallbackSuggestions,
      missingAngles: ['Specific technical hurdles faced', 'Concrete personal contribution'],
      elaborationTip: 'Elaborate on what you personally engineered and how you verified it.',
      source: 'local',
    });
    return;
  }

  try {
    const prompt = `
You are Portfolia's Content Coach for students and job applicants.
Analyze the user's existing draft for the "${section}" section and generate 3 to 4 hyper-relevant, constructive questions and prompts to help them elaborate further and ensure comprehensive, compelling content.

Existing draft data:
${JSON.stringify(data, null, 2)}

${HONESTY_INSTRUCTIONS}
Instructions:
- Look at the technologies, roles, and descriptions provided.
- If they listed technologies (e.g. React, Python), ask how they used them or what architectural decisions they made.
- If they haven't explained personal contribution, prompt them on their specific role.
- If challenges or learnings are vague, ask probing questions about debugging, performance, or user feedback.
- Do NOT fabricate facts. Provide thoughtful prompts for the USER to answer.

Respond strictly in JSON format:
{
  "suggestions": [
    {
      "category": "e.g. Technical Hurdles | Architecture | Impact | Collaboration",
      "question": "Specific, probing question based on what they already entered",
      "samplePrompt": "Short beginner-friendly starter sentence they could adapt"
    }
  ],
  "missingAngles": [
    "Short 3-5 word descriptor of what's currently missing"
  ],
  "elaborationTip": "1 concise sentence summarizing the most impactful detail to add next"
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        res.json({ ...parsed, source: 'gemini' });
        return;
      } catch (e) {
        // Fallback
      }
    }

    res.json({
      suggestions: fallbackSuggestions,
      missingAngles: ['Technical roadblocks', 'Personal contribution'],
      elaborationTip: 'Detail the concrete steps you took and what was learned.',
      source: 'local',
    });
  } catch (err: any) {
    console.error('Suggest prompts error:', err?.message || err);
    res.json({
      suggestions: fallbackSuggestions,
      missingAngles: ['Specific contribution', 'Technical challenges'],
      elaborationTip: 'Highlight your specific role and key hurdles solved.',
      source: 'local_fallback',
    });
  }
});

// Setup Vite middleware in dev or static serve in prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolia server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
