import React, { useState } from 'react';
import { PersonalProfile, PortfolioData } from '../../types/portfolio';
import { Sparkles, MapPin, User, Tag, Plus, X, Lightbulb } from 'lucide-react';
import { AiPolishModal } from './AiPolishModal';
import { suggestHeadlines } from '../../services/aiService';

interface Props {
  profile: PersonalProfile;
  portfolioData: PortfolioData;
  onChange: (updated: PersonalProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
];

export const IntroductionEditor: React.FC<Props> = ({ profile, portfolioData, onChange }) => {
  const [isAiBioOpen, setIsAiBioOpen] = useState(false);
  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([]);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const [interestInput, setInterestInput] = useState('');

  const updateField = (key: keyof PersonalProfile, value: any) => {
    onChange({
      ...profile,
      [key]: value,
    });
  };

  const handleSuggestHeadlines = async () => {
    setIsGeneratingHeadlines(true);
    try {
      const topProject = portfolioData.projects[0]?.title || '';
      const allSkills = [
        ...portfolioData.skills.programming.map(s => s.name),
        ...portfolioData.skills.tools.map(s => s.name),
      ];

      const list = await suggestHeadlines({
        name: profile.fullName,
        situation: portfolioData.onboarding.situation,
        goal: portfolioData.onboarding.goal,
        targetRole: profile.careerInterests[0] || '',
        skills: allSkills,
        topProject,
      });
      setSuggestedHeadlines(list);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGeneratingHeadlines(false);
    }
  };

  const addInterest = () => {
    if (!interestInput.trim()) return;
    const exists = profile.careerInterests.includes(interestInput.trim());
    if (!exists) {
      updateField('careerInterests', [...profile.careerInterests, interestInput.trim()]);
    }
    setInterestInput('');
  };

  const removeInterest = (item: string) => {
    updateField('careerInterests', profile.careerInterests.filter(i => i !== item));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-900">
          Personal Information & Introduction
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Give visitors a clear, welcoming introduction to who you are and what you study.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            General Location (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g. Seattle, WA or London, UK"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Professional Headline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            Professional Headline <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleSuggestHeadlines}
            disabled={isGeneratingHeadlines}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingHeadlines ? 'Suggesting...' : '✨ Suggest with AI'}</span>
          </button>
        </div>

        <input
          type="text"
          value={profile.headline}
          onChange={(e) => updateField('headline', e.target.value)}
          placeholder="e.g. Computer Science Student | Passionate about Full-Stack Systems & Open Source"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />

        {/* Headline suggestions dropdown */}
        {suggestedHeadlines.length > 0 && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
              <span>Suggested honest student headlines:</span>
            </div>
            <div className="space-y-1.5">
              {suggestedHeadlines.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    updateField('headline', h);
                    setSuggestedHeadlines([]);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white border border-indigo-200/60 text-xs text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 transition-colors flex items-center justify-between group"
                >
                  <span>{h}</span>
                  <span className="text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100">
                    Use this
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Short Bio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            Short Introduction / Bio
          </label>
          {profile.bio && (
            <button
              type="button"
              onClick={() => setIsAiBioOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Polish Bio</span>
            </button>
          )}
        </div>

        <textarea
          rows={3}
          value={profile.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          placeholder="Briefly describe what you study, topics that excite you, and what opportunities or collaborations you are looking for..."
          className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />

        <p className="text-[11px] text-slate-400">
          Tip: Write rough bullets or a few honest lines, then click "Polish Bio" to improve flow without exaggerating.
        </p>
      </div>

      {/* Avatar / Profile Photo */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700">
          Profile Photo (Optional)
        </label>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
              <User className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 space-y-2 w-full">
            <input
              type="url"
              value={profile.avatarUrl}
              onChange={(e) => updateField('avatarUrl', e.target.value)}
              placeholder="Paste image URL (e.g. GitHub avatar, Unsplash, or personal host)"
              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Or pick a sample avatar:</span>
              <div className="flex items-center gap-1.5">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateField('avatarUrl', url)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 hover:scale-110 transition-transform"
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {profile.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => updateField('avatarUrl', '')}
                    className="text-[11px] text-red-500 hover:underline ml-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Interests */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700">
          Career Interests & Target Roles
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest();
              }
            }}
            placeholder="e.g. Frontend Development, UI/UX Design, Data Science"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button
            type="button"
            onClick={addInterest}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Add
          </button>
        </div>

        {profile.careerInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.careerInterests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Polish Modal for Bio */}
      <AiPolishModal
        isOpen={isAiBioOpen}
        onClose={() => setIsAiBioOpen(false)}
        originalText={profile.bio}
        fieldName="Introduction Bio"
        onApply={(polished) => updateField('bio', polished)}
        context={{
          situation: portfolioData.onboarding.situation,
          goal: portfolioData.onboarding.goal,
          careerInterests: profile.careerInterests,
        }}
      />
    </div>
  );
};
