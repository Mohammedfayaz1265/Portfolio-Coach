import React from 'react';
import { CoachSuggestion } from '../../utils/completenessCoach';
import { Sparkles, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { SectionId } from '../../types/portfolio';

interface Props {
  suggestions: CoachSuggestion[];
  onNavigateSection: (sectionId: SectionId) => void;
}

export const CompletenessCoachPanel: React.FC<Props> = ({ suggestions, onNavigateSection }) => {
  if (suggestions.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            All Key Sections Complete!
          </h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your portfolio has clear projects, education, competencies, and contact points. You can preview and export your draft now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 p-4 sm:p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Completeness Coach (Top 3 Recommendations)
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
          Honest Guidance
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Actionable ideas to strengthen your portfolio without needing 5 years of industry experience:
      </p>

      <div className="space-y-2 pt-1">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            className="rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs"
          >
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {sug.title}
                </span>
                {sug.priority === 'high' && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    High Impact
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {sug.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateSection(sug.targetSection as SectionId)}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 shrink-0 self-end sm:self-center hover:underline"
            >
              <span>{sug.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
