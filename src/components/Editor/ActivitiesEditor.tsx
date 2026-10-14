import React, { useState } from 'react';
import { ActivityItem, ActivityCategory } from '../../types/portfolio';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit2, Users, X, AlertTriangle } from 'lucide-react';

interface Props {
  activities: ActivityItem[];
  onChange: (updated: ActivityItem[]) => void;
}

const DEFAULT_NEW_ACT: Omit<ActivityItem, 'id'> = {
  category: 'leadership',
  title: '',
  organization: '',
  period: '',
  description: '',
  link: '',
};

export const ActivitiesEditor: React.FC<Props> = ({ activities, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ActivityItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const startAdd = () => {
    const newItem: ActivityItem = {
      ...DEFAULT_NEW_ACT,
      id: `act-${Date.now()}`,
    };
    setFormData(newItem);
    setEditingId(newItem.id);
  };

  const startEdit = (item: ActivityItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const saveForm = () => {
    if (!formData || !formData.title.trim()) return;
    const exists = activities.some(a => a.id === formData.id);
    if (exists) {
      onChange(activities.map(a => (a.id === formData.id ? formData : a)));
    } else {
      onChange([...activities, formData]);
    }
    setEditingId(null);
    setFormData(null);
  };

  const confirmDelete = (id: string) => {
    onChange(activities.filter(a => a.id !== id));
    setIsDeletingId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activities.length) return;
    const reordered = [...activities];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            My Activities & Leadership ({activities.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Student clubs, volunteering, hackathon teams, community initiatives, or research.
          </p>
        </div>

        {!editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Activity</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {activities.length === 0 && !editingId && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            No activities added yet
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Campus clubs, community volunteering, hackathon organizing, or sports teams prove communication and leadership skills.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity or Club</span>
          </button>
        </div>
      )}

      {/* Form */}
      {editingId && formData && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm ring-1 ring-indigo-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-sm text-slate-900">
              {activities.some(a => a.id === formData.id) ? 'Edit Activity' : 'Add Activity'}
            </span>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title / Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Vice President or Volunteer Instructor"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Club
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Women in CS Student Chapter or CoderDojo"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="leadership">Leadership & Student Government</option>
                <option value="club">Student Club / Society</option>
                <option value="volunteering">Volunteering & Community Service</option>
                <option value="competition">Hackathons & Competitions</option>
                <option value="creative">Creative / Content Creation</option>
                <option value="research">Research / Publications</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Period
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. Sep 2023 — Present or Spring 2024"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Responsibilities
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Coordinated logistics for monthly technical workshops and organized a 60-person coding study jam."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Website or Social Link (Optional)
            </label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveForm}
              disabled={!formData.title.trim()}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-2xs"
            >
              Save Activity
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!editingId && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((act, idx) => (
            <div
              key={act.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                  <span className="text-xs text-slate-500 font-medium">@ {act.organization}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {act.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{act.period}</p>
                {act.description && (
                  <p className="text-xs text-slate-600 line-clamp-1">{act.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === activities.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(act)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Edit Activity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(act.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Activity"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Activity?</h4>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(isDeletingId)}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-2xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
