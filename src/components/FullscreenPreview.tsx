import React from 'react';
import { PortfolioData, PortfolioStyle } from '../types/portfolio';
import { ArrowLeft, Printer, Share2, Palette } from 'lucide-react';
import { PortfolioRenderer } from './Templates/PortfolioRenderer';

interface Props {
  portfolioData: PortfolioData;
  onBackToEdit: () => void;
  onUpdateTemplate: (template: PortfolioStyle) => void;
  onOpenPublish: () => void;
}

export const FullscreenPreview: React.FC<Props> = ({
  portfolioData,
  onBackToEdit,
  onUpdateTemplate,
  onOpenPublish,
}) => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Toolbar - hidden during print */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-700/50">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Editing</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

        {/* Template Quick Switcher */}
        <div className="flex items-center gap-1">
          {(['professional', 'creative', 'minimal'] as PortfolioStyle[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onUpdateTemplate(t)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors font-medium ${
                portfolioData.template === t
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

        <button
          type="button"
          onClick={() => window.print()}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Print / Save PDF"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenPublish}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Main Rendered Portfolio */}
      <PortfolioRenderer data={portfolioData} isPublic={true} />
    </div>
  );
};
