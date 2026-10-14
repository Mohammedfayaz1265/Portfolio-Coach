import React, { useState } from 'react';
import { EducationItem } from '../../types/portfolio';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit2, BookOpen, X, AlertTriangle } from 'lucide-react';

interface Props {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

const DEFAULT_NEW_EDU: Omit<EducationItem, 'id'> = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startYear: '',
  endYear: '',
  grade: '',
  coursework: [],
};

export const EducationEditor: React.FC<Props> = ({ education, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [courseInput, setCourseInput] = useState('');

  const startAdd = () => {
    const newItem: EducationItem = {
      ...DEFAULT_NEW_EDU,
      id: `edu-${Date.now()}`,
    };
    setFormData(newItem);
    setEditingId(newItem.id);
  };

  const startEdit = (item: EducationItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const saveForm = () => {
    if (!formData || !formData.institution.trim()) return;
    const exists = education.some(e => e.id === formData.id);
    if (exists) {
      onChange(education.map(e => (e.id === formData.id ? formData : e)));
    } else {
      onChange([...education, formData]);
    }
    setEditingId(null);
    setFormData(null);
  };

  const confirmDelete = (id: string) => {
    onChange(education.filter(e => e.id !== id));
    setIsDeletingId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= education.length) return;
    const reordered = [...education];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered);
  };

  const addCourse = () => {
    if (!courseInput.trim() || !formData) return;
    const current = formData.coursework || [];
    if (!current.includes(courseInput.trim())) {
      setFormData({
        ...formData,
        coursework: [...current, courseInput.trim()],
      });
    }
    setCourseInput('');
  };

  const removeCourse = (course: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      coursework: (formData.coursework || []).filter(c => c !== course),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            My Education ({education.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your high school, college, university, or current coursework.
          </p>
        </div>

        {!editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Education</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {education.length === 0 && !editingId && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            No education added yet
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add where you are currently studying or graduated from. Including relevant coursework helps recruiters see your foundation.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your School / University</span>
          </button>
        </div>
      )}

      {/* Form */}
      {editingId && formData && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm ring-1 ring-indigo-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-sm text-slate-900">
              {education.some(e => e.id === formData.id) ? 'Edit Education' : 'Add Education'}
            </span>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institution Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. University of Washington or Lincoln High School"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree or Qualification
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. Bachelor of Science, High School Diploma"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch / Specialization / Major
              </label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder="e.g. Computer Science, Interactive Media, Biology"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={formData.startYear}
                onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                placeholder="e.g. 2023"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Graduation (or Expected) Year
              </label>
              <input
                type="text"
                value={formData.endYear}
                onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                placeholder="e.g. 2027 (Expected)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grade / CGPA (Optional)
              </label>
              <input
                type="text"
                value={formData.grade || ''}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g. 3.8 GPA or First Class"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Relevant Coursework */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Relevant Coursework (Optional)
            </label>
            <p className="text-[11px] text-slate-400">
              Adding courses shows recruiters your academic preparation even before your first job.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCourse();
                  }
                }}
                placeholder="e.g. Data Structures, Web Architecture, UX Design"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={addCourse}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Add Course
              </button>
            </div>

            {formData.coursework && formData.coursework.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.coursework.map((course, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md"
                  >
                    <span>{course}</span>
                    <button
                      type="button"
                      onClick={() => removeCourse(course)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
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
              disabled={!formData.institution.trim()}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-2xs"
            >
              Save Education
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!editingId && education.length > 0 && (
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div
              key={edu.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{edu.institution}</h4>
                  <span className="text-xs text-slate-400">
                    {edu.startYear} — {edu.endYear}
                  </span>
                </div>
                <p className="text-xs text-indigo-700 font-medium">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  {edu.grade && <span className="text-slate-500 font-normal"> ({edu.grade})</span>}
                </p>
                {edu.coursework && edu.coursework.length > 0 && (
                  <p className="text-[11px] text-slate-500">
                    Courses: {edu.coursework.join(', ')}
                  </p>
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
                  disabled={idx === education.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(edu)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Edit Education"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeletingId(edu.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Education Entry?</h4>
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
