import React, { useState } from 'react';
import { PortfolioData } from '../../types/portfolio';
import {
  X,
  Download,
  Share2,
  Printer,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  Globe,
  Upload,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: PortfolioData;
  onEnterFullscreenPreview: () => void;
  onImportJson: (imported: PortfolioData) => void;
}

export const PublishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  portfolioData,
  onEnterFullscreenPreview,
  onImportJson,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(portfolioData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `portfolia-${portfolioData.profile.fullName ? portfolioData.profile.fullName.toLowerCase().replace(/\s+/g, '-') : 'student'}-portfolio.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintPdf = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleCopyLocalUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.sections) {
          onImportJson(parsed);
          onClose();
        } else {
          setImportError('Invalid portfolio backup file.');
        }
      } catch (err) {
        setImportError('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Publish & Export Your Portfolio
              </h3>
              <p className="text-xs text-slate-500">
                Honest publishing, backup exports, and sharing options.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Honest storage explanation */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>How Your Portfolio Is Saved & Shared</span>
          </div>
          <p className="leading-relaxed">
            Your draft is automatically saved in your browser's persistent local storage. Because this MVP does not require accounts or third-party tracking, public hosting requires deploying your files or exporting a backup.
          </p>
        </div>

        {/* Action Options */}
        <div className="space-y-3">
          {/* Fullscreen clean preview */}
          <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                1. Inspect Clean Public View
              </h4>
              <p className="text-[11px] text-slate-500">
                View your portfolio without editor controls or navigation bars.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnterFullscreenPreview();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shrink-0"
            >
              Public Preview
            </button>
          </div>

          {/* Export JSON backup */}
          <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                2. Download Backup (JSON)
              </h4>
              <p className="text-[11px] text-slate-500">
                Save a portable copy of all your answers, projects, and skills to your computer.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shrink-0 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download</span>
            </button>
          </div>

          {/* Print / Save PDF */}
          <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                3. Print or Save as PDF
              </h4>
              <p className="text-[11px] text-slate-500">
                Generates a clean printable or PDF resume-style student document.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shrink-0 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                4. Restore from Backup
              </h4>
              <p className="text-[11px] text-slate-500">
                Load a previously saved Portfolia backup file.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shrink-0 shadow-2xs cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importError && (
          <p className="text-xs text-red-600 font-medium">{importError}</p>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
