import React, { useState } from 'react';
import { Sparkles, HelpCircle, ArrowRight, RefreshCw, Check, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { suggestElaborationPrompts, ElaborationSuggestion } from '../../services/aiService';

interface Props {
  section: 'projects' | 'experience';
  formData: Record<string, any>;
  onApplyPromptToField?: (fieldName: string, textToAppend: string) => void;
  targetFieldName?: string;
}

export const AiContentCoach: React.FC<Props> = ({
  section,
  formData,
  onApplyPromptToField,
  targetFieldName = 'personalContribution',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ElaborationSuggestion[]>([]);
  const [missingAngles, setMissingAngles] = useState<string[]>([]);
  const [elaborationTip, setElaborationTip] = useState<string>('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await suggestElaborationPrompts(section, formData);
      setSuggestions(res.suggestions);
      setMissingAngles(res.missingAngles);
      setElaborationTip(res.elaborationTip);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger initial quick suggestions if none yet
  React.useEffect(() => {
    if (suggestions.length === 0 && (formData.title || formData.role || formData.tagline)) {
      handleAnalyze();
    }
  }, [formData.title, formData.role]);

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#0c1324] via-[#090e1a] to-[#0d162b] p-4 text-slate-100 shadow-[0_0_20px_rgba(37,99,235,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            AI Content Coach & Elaboration Assistant
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-[11px] font-semibold text-blue-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analyzing...' : 'Analyze My Input'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3.5 text-xs">
          {/* Missing Angles Pills */}
          {missingAngles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Consider detailing:
              </span>
              {missingAngles.map((angle, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300"
                >
                  + {angle}
                </span>
              ))}
            </div>
          )}

          {/* Elaboration Tip */}
          {elaborationTip && (
            <div className="rounded-xl bg-slate-900/90 border border-blue-500/20 p-2.5 flex items-start gap-2 text-slate-300">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-white font-semibold">Coach Tip: </strong>
                {elaborationTip}
              </p>
            </div>
          )}

          {/* Probing Questions & Suggested Starters */}
          {suggestions.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Recommended Details & Follow-up Questions:
              </span>

              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#070b14]/90 p-3 hover:border-blue-500/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {sug.category}
                      </span>

                      {onApplyPromptToField && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyPromptToField(targetFieldName, sug.samplePrompt);
                            setCopiedIdx(idx);
                            setTimeout(() => setCopiedIdx(null), 1500);
                          }}
                          className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Inserted!</span>
                            </>
                          ) : (
                            <>
                              <span>Insert Starter</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 font-medium leading-snug">
                      {sug.question}
                    </p>

                    <p className="text-[11px] text-slate-400 italic">
                      {sug.samplePrompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              Type your project or experience details above and click "Analyze My Input" for tailored prompts.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
