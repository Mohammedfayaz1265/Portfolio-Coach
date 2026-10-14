import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { improveText } from '../../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  fieldName: string;
  onApply: (improvedText: string) => void;
  context?: Record<string, any>;
}

export const AiPolishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  originalText,
  fieldName,
  onApply,
  context,
}) => {
  const [tone, setTone] = useState<'simple' | 'professional' | 'technical'>('professional');
  const [length, setLength] = useState<'short' | 'detailed'>('short');
  const [improvedText, setImprovedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!originalText.trim()) {
      setError('Please write some notes first before asking the assistant to polish them.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await improveText({
        text: originalText,
        fieldName,
        tone,
        length,
        context,
      });
      setImprovedText(res.improved);
      setNotice(res.notice || 'AI-generated content should be reviewed before publishing.');
    } catch (e: any) {
      setError(e?.message || 'Failed to improve text');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto trigger on first open if improvedText is empty
  React.useEffect(() => {
    if (isOpen && !improvedText && originalText.trim()) {
      handleGenerate();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Polish {fieldName} with AI
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls: Tone & Length */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Target Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="professional">Professional</option>
              <option value="simple">Simple & Natural</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="short">Concise / Short</option>
              <option value="detailed">Detailed / Structured</option>
            </select>
          </div>
        </div>

        {/* Original vs Improved */}
        <div className="space-y-3">
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Your rough notes:
            </span>
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/70 p-3 rounded-xl max-h-24 overflow-y-auto">
              {originalText || <span className="italic text-slate-400">Empty notes</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase text-indigo-700">
                Polished Suggestion:
              </span>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {isLoading ? (
              <div className="h-28 rounded-xl border border-indigo-100 bg-indigo-50/40 flex flex-col items-center justify-center text-xs text-indigo-600 gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Polishing without exaggerating...</span>
              </div>
            ) : (
              <textarea
                value={improvedText}
                onChange={(e) => setImprovedText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Polished text will appear here..."
              />
            )}
          </div>
        </div>

        {/* Honesty disclaimer banner */}
        <div className="rounded-xl bg-amber-50/80 border border-amber-200/70 p-2.5 flex items-start gap-2 text-[11px] text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Honesty Guarantee: </span>
            Portfolia never invents qualifications or launched product metrics. Always verify that details match your real experience before publishing.
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (improvedText) {
                onApply(improvedText);
                onClose();
              }
            }}
            disabled={!improvedText || isLoading}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply to {fieldName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
