import React, { useState } from 'react';
import { ProjectItem, ProjectStatus } from '../../types/portfolio';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Sparkles,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  X,
  Code2,
  HelpCircle,
} from 'lucide-react';
import { AiPolishModal } from './AiPolishModal';
import { AiContentCoach } from './AiContentCoach';
import { generateProjectSummary } from '../../services/aiService';

interface Props {
  projects: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

const DEFAULT_NEW_PROJECT: Omit<ProjectItem, 'id'> = {
  title: '',
  tagline: '',
  description: '',
  problem: '',
  targetAudience: '',
  personalContribution: '',
  isTeam: false,
  techStack: [],
  workingFeatures: [],
  challenges: '',
  learnings: '',
  status: 'completed',
  demoUrl: '',
  githubUrl: '',
  imageUrl: '',
  featured: true,
};

export const ProjectsEditor: React.FC<Props> = ({ projects, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form helper inputs
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [isAiPolishingField, setIsAiPolishingField] = useState<'description' | 'personalContribution' | 'challenges' | null>(null);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);

  const startAdd = () => {
    const newItem: ProjectItem = {
      ...DEFAULT_NEW_PROJECT,
      id: `proj-${Date.now()}`,
    };
    setFormData(newItem);
    setEditingId(newItem.id);
  };

  const startEdit = (item: ProjectItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const saveForm = () => {
    if (!formData || !formData.title.trim()) return;

    const exists = projects.some(p => p.id === formData.id);
    if (exists) {
      onChange(projects.map(p => (p.id === formData.id ? formData : p)));
    } else {
      onChange([...projects, formData]);
    }
    setEditingId(null);
    setFormData(null);
  };

  const confirmDelete = (id: string) => {
    onChange(projects.filter(p => p.id !== id));
    setIsDeletingId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered);
  };

  const addTechTag = () => {
    if (!techInput.trim() || !formData) return;
    if (!formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
    }
    setTechInput('');
  };

  const removeTechTag = (tag: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tag),
    });
  };

  const addWorkingFeature = () => {
    if (!featureInput.trim() || !formData) return;
    setFormData({
      ...formData,
      workingFeatures: [...formData.workingFeatures, featureInput.trim()],
    });
    setFeatureInput('');
  };

  const removeWorkingFeature = (idx: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      workingFeatures: formData.workingFeatures.filter((_, i) => i !== idx),
    });
  };

  const handleAiAutoSummary = async () => {
    if (!formData || !formData.title.trim() || !formData.tagline.trim()) {
      alert('Please provide at least a project title and what it does first.');
      return;
    }
    setIsGeneratingAiSummary(true);
    try {
      const res = await generateProjectSummary({
        projectName: formData.title,
        whatItDoes: formData.tagline,
        problem: formData.problem,
        contribution: formData.personalContribution,
        techStack: formData.techStack,
        status: formData.status,
      });

      setFormData({
        ...formData,
        description: res.summary,
        workingFeatures: res.bullets && res.bullets.length > 0 ? res.bullets : formData.workingFeatures,
      });
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  // Append AI prompt suggestion directly to contribution or challenge field
  const handleInsertCoachPrompt = (fieldName: string, textToAppend: string) => {
    if (!formData) return;
    const currentVal = (formData as any)[fieldName] || '';
    const updatedVal = currentVal ? `${currentVal} ${textToAppend}` : textToAppend;
    setFormData({
      ...formData,
      [fieldName]: updatedVal,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>My Projects</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono">
              {projects.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Class assignments, personal experiments, hackathon builds, and group projects.
          </p>
        </div>

        {!editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Project</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 && !editingId && (
        <div className="rounded-2xl border-2 border-dashed border-slate-800/80 p-8 text-center bg-[#090d18]/70 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">
            No projects added yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            College assignments, semester labs, or weekend scripts are great projects. You don’t need a venture-backed startup!
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your First Project</span>
          </button>
        </div>
      )}

      {/* Project Form (Guided Questions with AI Content Coach) */}
      {editingId && formData && (
        <div className="rounded-2xl border border-blue-500/30 bg-[#0a0f1d] p-5 sm:p-6 space-y-6 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              {projects.some(p => p.id === formData.id) ? 'Edit Project' : 'New Project Guide'}
            </span>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI-Powered Content Coach Panel embedded at the top of the form */}
          <AiContentCoach
            section="projects"
            formData={formData}
            onApplyPromptToField={handleInsertCoachPrompt}
            targetFieldName="personalContribution"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. StudySync or Campus Waste Lens"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="completed">Completed Project</option>
                <option value="in_progress">In Progress</option>
                <option value="prototype">Prototype / Proof of Concept</option>
                <option value="idea">Early Idea / Planning</option>
              </select>
            </div>
          </div>

          {/* What does it do */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              What does it do in one line? <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. A web app helping university students form study groups by matching course breaks."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Technologies Used */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Technologies Actually Used
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechTag();
                  }
                }}
                placeholder="e.g. React, Python, CSS Grid, SQLite"
                className="flex-1 rounded-xl border border-slate-800 bg-[#060a14] px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTechTag}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Add Tech
              </button>
            </div>

            {formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-300 bg-blue-950/70 border border-blue-500/30 px-2.5 py-0.5 rounded-md"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => removeTechTag(tech)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Personal Contribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                What did YOU personally build or contribute?
              </label>
              {formData.personalContribution && (
                <button
                  type="button"
                  onClick={() => setIsAiPolishingField('personalContribution')}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ Polish</span>
                </button>
              )}
            </div>

            <textarea
              rows={2}
              value={formData.personalContribution}
              onChange={(e) => setFormData({ ...formData, personalContribution: e.target.value })}
              placeholder="e.g. Designed the interactive calendar grid, implemented local search filters in React, and wrote the user guide."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTeam}
                  onChange={(e) => setFormData({ ...formData, isTeam: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 bg-[#060a14] border-slate-700"
                />
                <span>This was a team or group project</span>
              </label>
            </div>
          </div>

          {/* Problem and Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                What problem does it address?
              </label>
              <input
                type="text"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="e.g. In large lectures, finding compatible study buddies is difficult."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Who is it for?
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. Undergraduate STEM students and study hall peers"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Challenges & Learnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Challenges Faced & Roadblocks Solved
              </label>
              <textarea
                rows={2}
                value={formData.challenges || ''}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                placeholder="e.g. Debugged state synchronization across overlapping timeslot selections."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                What Was Learned
              </label>
              <textarea
                rows={2}
                value={formData.learnings || ''}
                onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                placeholder="e.g. Gained hands-on experience with modular React architecture and CSS Grid."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Working Features */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Which features currently work?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addWorkingFeature();
                  }
                }}
                placeholder="e.g. Interactive weekly calendar grid with conflict check"
                className="flex-1 rounded-xl border border-slate-800 bg-[#060a14] px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addWorkingFeature}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Add Feature
              </button>
            </div>

            {formData.workingFeatures.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {formData.workingFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs text-slate-300 bg-[#070b14] border border-slate-800 px-3 py-1.5 rounded-lg"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {feat}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeWorkingFeature(idx)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Synopsis Generator */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-blue-300 block">
                ✨ Generate Honest Project Summary with AI
              </span>
              <p className="text-[11px] text-slate-400">
                Synthesizes your answers and technical contributions into a professional synopsis without exaggerating.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiAutoSummary}
              disabled={isGeneratingAiSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50 shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isGeneratingAiSummary ? 'Generating...' : 'Auto-Summarize'}</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Full Project Description
              </label>
              {formData.description && (
                <button
                  type="button"
                  onClick={() => setIsAiPolishingField('description')}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ Polish</span>
                </button>
              )}
            </div>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the project, architecture, and results..."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Links & Media */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Demo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Source Code URL (Optional)
              </label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Screenshot URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Save / Cancel buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveForm}
              disabled={!formData.title.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Save Project
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {!editingId && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="rounded-xl border border-slate-800 bg-[#090e1a] p-4 shadow-sm hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{proj.title}</h4>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/20 text-blue-300">
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-lg line-clamp-1">
                  {proj.tagline || proj.description}
                </p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((t, i) => (
                      <span key={i} className="text-[10px] text-blue-300 bg-blue-950/40 border border-blue-500/20 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions: Reorder, Edit, Delete */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-20"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === projects.length - 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(proj)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(proj.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0b1020] rounded-2xl border border-slate-800 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Delete Project?</h4>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(isDeletingId)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Polish Modal */}
      {isAiPolishingField && formData && (
        <AiPolishModal
          isOpen={true}
          onClose={() => setIsAiPolishingField(null)}
          originalText={formData[isAiPolishingField] || ''}
          fieldName={isAiPolishingField === 'description' ? 'Project Description' : isAiPolishingField === 'personalContribution' ? 'Personal Contribution' : 'Challenges Faced'}
          onApply={(improved) => {
            setFormData({
              ...formData,
              [isAiPolishingField]: improved,
            });
          }}
          context={{
            projectName: formData.title,
            problem: formData.problem,
            techStack: formData.techStack,
          }}
        />
      )}
    </div>
  );
};
