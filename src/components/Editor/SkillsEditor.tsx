import React, { useState } from 'react';
import { SkillCategories, SkillItem, SkillStage } from '../../types/portfolio';
import { Plus, X, Sparkles } from 'lucide-react';

interface Props {
  skills: SkillCategories;
  onChange: (updated: SkillCategories) => void;
}

export const SkillsEditor: React.FC<Props> = ({ skills, onChange }) => {
  const [activeCategory, setActiveCategory] = useState<keyof SkillCategories>('programming');
  const [skillName, setSkillName] = useState('');
  const [skillStage, setSkillStage] = useState<SkillStage>('practicing');

  const categories: { key: keyof SkillCategories; label: string; desc: string; presets: string[] }[] = [
    {
      key: 'programming',
      label: 'Programming & Tech',
      desc: 'Languages, frontend, backend & databases',
      presets: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'HTML5/CSS3', 'SQL', 'React', 'Node.js'],
    },
    {
      key: 'tools',
      label: 'Tools & Software',
      desc: 'Version control, dev tools, editors & cloud',
      presets: ['Git & GitHub', 'VS Code', 'Postman', 'Docker', 'Linux/Bash', 'Vite', 'Figma'],
    },
    {
      key: 'analytical',
      label: 'Analytical & Problem-Solving',
      desc: 'Testing, data analysis & structured reasoning',
      presets: ['Data Structures & Algorithms', 'Debugging & Profiling', 'Unit Testing', 'Requirement Analysis', 'Statistical Analysis'],
    },
    {
      key: 'communication',
      label: 'Communication & Teamwork',
      desc: 'Collaboration, peer review & leadership',
      presets: ['Technical Documentation', 'Peer Mentoring', 'Agile / Scrum', 'Presentations', 'Code Reviews'],
    },
    {
      key: 'creative',
      label: 'Creative & Design',
      desc: 'UI wireframing, accessible design & media',
      presets: ['UI/UX Wireframing', 'Accessible Design (WCAG)', 'Graphic Design', 'Video Editing', 'Design Systems'],
    },
    {
      key: 'languages',
      label: 'Languages',
      desc: 'Spoken / natural languages',
      presets: ['English (Fluent)', 'Spanish (Conversational)', 'Mandarin (Native)', 'French (Intermediate)'],
    },
  ];

  const addSkill = (nameToAdd?: string) => {
    const targetName = (nameToAdd || skillName).trim();
    if (!targetName) return;

    const currentList = skills[activeCategory] || [];
    const exists = currentList.some(s => s.name.toLowerCase() === targetName.toLowerCase());
    if (exists) return;

    const newItem: SkillItem = {
      name: targetName,
      stage: skillStage,
    };

    onChange({
      ...skills,
      [activeCategory]: [...currentList, newItem],
    });

    if (!nameToAdd) {
      setSkillName('');
    }
  };

  const removeSkill = (category: keyof SkillCategories, index: number) => {
    const currentList = skills[category] || [];
    onChange({
      ...skills,
      [category]: currentList.filter((_, i) => i !== index),
    });
  };

  const updateSkillStage = (category: keyof SkillCategories, index: number, stage: SkillStage) => {
    const currentList = [...skills[category]];
    if (currentList[index]) {
      currentList[index] = { ...currentList[index], stage };
      onChange({
        ...skills,
        [category]: currentList,
      });
    }
  };

  const currentCatConfig = categories.find(c => c.key === activeCategory)!;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-900">
          My Skills & Competencies
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Categorize what you know honestly by whether you are learning, practicing, or have demonstrated it in real projects.
        </p>
      </div>

      {/* Category selector tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
        {categories.map((cat) => {
          const count = skills[cat.key]?.length || 0;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input box for current category */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Add to {currentCatConfig.label}
            </h4>
            <p className="text-[11px] text-slate-500">{currentCatConfig.desc}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder={`e.g. ${currentCatConfig.presets[0]} or custom skill...`}
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />

          <select
            value={skillStage}
            onChange={(e) => setSkillStage(e.target.value as SkillStage)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
          >
            <option value="learning">Stage: Learning</option>
            <option value="practicing">Stage: Practicing</option>
            <option value="demonstrated">Stage: Demonstrated</option>
          </select>

          <button
            type="button"
            onClick={() => addSkill()}
            disabled={!skillName.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Quick Suggestions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentCatConfig.presets.map((preset, idx) => {
              const alreadyAdded = skills[activeCategory]?.some(
                s => s.name.toLowerCase() === preset.toLowerCase()
              );
              if (alreadyAdded) return null;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addSkill(preset)}
                  className="text-xs text-slate-700 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current skills in active category */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Current {currentCatConfig.label} ({skills[activeCategory]?.length || 0})
        </h4>

        {(!skills[activeCategory] || skills[activeCategory].length === 0) ? (
          <p className="text-xs text-slate-400 italic py-2">
            No skills added to this category yet. Click a suggestion above or enter your own.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {skills[activeCategory].map((skill, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-2.5 px-3 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">{skill.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={skill.stage}
                    onChange={(e) => updateSkillStage(activeCategory, idx, e.target.value as SkillStage)}
                    className="text-[10px] font-semibold rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700"
                  >
                    <option value="learning">Learning</option>
                    <option value="practicing">Practicing</option>
                    <option value="demonstrated">Demonstrated</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeSkill(activeCategory, idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
