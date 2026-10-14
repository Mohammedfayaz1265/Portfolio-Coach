import React, { useState } from 'react';
import { ExperienceItem, ExperienceType } from '../../types/portfolio';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Briefcase,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { AiPolishModal } from './AiPolishModal';
import { AiContentCoach } from './AiContentCoach';

interface Props {
  experience: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

const DEFAULT_NEW_EXP: Omit<ExperienceItem, 'id'> = {
  type: 'internship',
  organization: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  responsibilities: '',
  contributions: '',
  outcomes: '',
  link: '',
};

export const ExperienceEditor: React.FC<Props> = ({ experience, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isAiPolishing, setIsAiPolishing] = useState<'responsibilities' | 'contributions' | 'outcomes' | null>(null);

  const startAdd = () => {
    const newItem: ExperienceItem = {
      ...DEFAULT_NEW_EXP,
      id: `exp-${Date.now()}`,
    };
    setFormData(newItem);
    setEditingId(newItem.id);
  };

  const startEdit = (item: ExperienceItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const saveForm = () => {
    if (!formData || !formData.organization.trim() || !formData.role.trim()) return;
    const exists = experience.some(e => e.id === formData.id);
    if (exists) {
      onChange(experience.map(e => (e.id === formData.id ? formData : e)));
    } else {
      onChange([...experience, formData]);
    }
    setEditingId(null);
    setFormData(null);
  };

  const confirmDelete = (id: string) => {
    onChange(experience.filter(e => e.id !== id));
    setIsDeletingId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experience.length) return;
    const reordered = [...experience];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered);
  };

  const handleInsertCoachPrompt = (fieldName: string, textToAppend: string) => {
    if (!formData) return;
    const currentVal = (formData as any)[fieldName] || '';
    const updatedVal = currentVal ? `${currentVal} ${textToAppend}` : textToAppend;
    setFormData({
      ...formData,
      [fieldName]: updatedVal,
    });
  };

  const experienceTypes: { id: ExperienceType; label: string }[] = [
    { id: 'internship', label: 'Internship' },
    { id: 'part_time', label: 'Part-time Job' },
    { id: 'full_time', label: 'Full-time Job' },
    { id: 'freelance', label: 'Freelance Work' },
    { id: 'campus_ambassador', label: 'Campus Ambassador / TA' },
    { id: 'volunteering', label: 'Volunteering' },
    { id: 'research', label: 'Research Experience' },
    { id: 'leadership', label: 'Club or Student Leadership' },
    { id: 'apprenticeship', label: 'Apprenticeship / Trainee' },
    { id: 'contract', label: 'Contract / Temporary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>My Experience</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono">
              {experience.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Internships, part-time jobs, campus roles, or research positions.
          </p>
        </div>

        {!editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Experience</span>
          </button>
        )}
      </div>

      {/* Friendly Empty State */}
      {experience.length === 0 && !editingId && (
        <div className="rounded-2xl border-2 border-dashed border-slate-800/80 p-8 text-center bg-[#090d18]/70 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">
            No experience yet? That's completely okay!
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            You can add internships, part-time jobs, volunteering or student leadership—or skip this section for now. Your projects and coursework will shine automatically.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a Role / Internship</span>
          </button>
        </div>
      )}

      {/* Form */}
      {editingId && formData && (
        <div className="rounded-2xl border border-blue-500/30 bg-[#0a0f1d] p-5 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              {experience.some(e => e.id === formData.id) ? 'Edit Experience' : 'Add Experience'}
            </span>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Content Coach for Experience */}
          <AiContentCoach
            section="experience"
            formData={formData}
            onApplyPromptToField={handleInsertCoachPrompt}
            targetFieldName="contributions"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Software Engineering Intern or Peer Tutor"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Organization / Company <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. CivicTech Lab or University Dept"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Experience Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExperienceType })}
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {experienceTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="e.g. Jun 2024"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="text"
                value={formData.isCurrent ? 'Present' : formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.isCurrent}
                placeholder="e.g. Aug 2024"
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
              />
              <label className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 bg-[#060a14] border-slate-700"
                />
                <span>I currently work / volunteer here</span>
              </label>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Responsibilities & Summary
              </label>
              {formData.responsibilities && (
                <button
                  type="button"
                  onClick={() => setIsAiPolishing('responsibilities')}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ Polish</span>
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              placeholder="e.g. Collaborated with a team of 4 student developers to build an open-source neighborhood transit dashboard."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contributions & Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Personal Contributions
                </label>
                {formData.contributions && (
                  <button
                    type="button"
                    onClick={() => setIsAiPolishing('contributions')}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Polish</span>
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={formData.contributions}
                onChange={(e) => setFormData({ ...formData, contributions: e.target.value })}
                placeholder="e.g. Built accessible filter components in React and audited WCAG AA contrast."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Outcomes / Learnings
                </label>
                {formData.outcomes && (
                  <button
                    type="button"
                    onClick={() => setIsAiPolishing('outcomes')}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Polish</span>
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={formData.outcomes}
                onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                placeholder="e.g. Delivered prototype tested by 120 community transit riders during summer beta."
                className="w-full rounded-xl border border-slate-800 bg-[#060a14] p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Relevant Project or Company Link (Optional)
            </label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-800 bg-[#060a14] px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              disabled={!formData.organization.trim() || !formData.role.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Save Experience
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!editingId && experience.length > 0 && (
        <div className="space-y-3">
          {experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="rounded-xl border border-slate-800 bg-[#090e1a] p-4 shadow-sm hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{exp.role}</h4>
                  <span className="text-xs text-slate-400 font-medium">@ {exp.organization}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/20 text-blue-300">
                    {exp.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                </p>
                {exp.responsibilities && (
                  <p className="text-xs text-slate-300 line-clamp-1">{exp.responsibilities}</p>
                )}
              </div>

              {/* Actions */}
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
                  disabled={idx === experience.length - 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(exp)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                  title="Edit Experience"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(exp.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  title="Delete Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0b1020] rounded-2xl border border-slate-800 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Delete Experience?</h4>
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

      {/* AI Polish Modal */}
      {isAiPolishing && formData && (
        <AiPolishModal
          isOpen={true}
          onClose={() => setIsAiPolishing(null)}
          originalText={formData[isAiPolishing] || ''}
          fieldName={isAiPolishing === 'responsibilities' ? 'Experience Summary' : isAiPolishing === 'contributions' ? 'Key Contributions' : 'Outcomes'}
          onApply={(polished) => {
            setFormData({
              ...formData,
              [isAiPolishing]: polished,
            });
          }}
          context={{
            role: formData.role,
            organization: formData.organization,
          }}
        />
      )}
    </div>
  );
};
