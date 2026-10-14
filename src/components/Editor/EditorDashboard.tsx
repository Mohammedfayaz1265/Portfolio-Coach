import React, { useState } from 'react';
import {
  PortfolioData,
  SectionId,
  PortfolioStyle,
  SectionConfig,
} from '../../types/portfolio';
import {
  User,
  BookOpen,
  Briefcase,
  Code2,
  Sparkles,
  Award,
  Users,
  Mail,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Monitor,
  Smartphone,
  Maximize2,
  Share2,
  RotateCcw,
  Compass,
  ArrowLeft,
  Check,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { IntroductionEditor } from './IntroductionEditor';
import { EducationEditor } from './EducationEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { SkillsEditor } from './SkillsEditor';
import { CertificatesEditor } from './CertificatesEditor';
import { ActivitiesEditor } from './ActivitiesEditor';
import { ContactEditor } from './ContactEditor';
import { PortfolioRenderer } from '../Templates/PortfolioRenderer';
import { CompletenessCoachPanel } from './CompletenessCoachPanel';
import { evaluatePortfolioCompleteness } from '../../utils/completenessCoach';
import { PublishModal } from './PublishModal';
import { ResetConfirmModal } from './ResetConfirmModal';

interface Props {
  portfolioData: PortfolioData;
  onUpdate: (data: PortfolioData) => void;
  onReset: () => void;
  onBackToLanding: () => void;
  onEnterFullscreen: () => void;
}

export const EditorDashboard: React.FC<Props> = ({
  portfolioData,
  onUpdate,
  onReset,
  onBackToLanding,
  onEnterFullscreen,
}) => {
  const [activeSection, setActiveSection] = useState<SectionId>('intro');
  const [mobileViewTab, setMobileViewTab] = useState<'edit' | 'preview'>('edit');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCoachExpanded, setIsCoachExpanded] = useState(true);

  const completenessSuggestions = evaluatePortfolioCompleteness(portfolioData);

  const sectionIcon = (id: SectionId) => {
    switch (id) {
      case 'intro':
        return <User className="w-4 h-4" />;
      case 'projects':
        return <Code2 className="w-4 h-4" />;
      case 'skills':
        return <Sparkles className="w-4 h-4" />;
      case 'education':
        return <BookOpen className="w-4 h-4" />;
      case 'experience':
        return <Briefcase className="w-4 h-4" />;
      case 'certificates':
        return <Award className="w-4 h-4" />;
      case 'activities':
        return <Users className="w-4 h-4" />;
      case 'contact':
        return <Mail className="w-4 h-4" />;
    }
  };

  const toggleSectionVisibility = (id: SectionId, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = portfolioData.sections.map(s =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    onUpdate({ ...portfolioData, sections: updated });
  };

  const moveSection = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= portfolioData.sections.length) return;
    const reordered = [...portfolioData.sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onUpdate({ ...portfolioData, sections: reordered });
  };

  const changeTemplate = (tmpl: PortfolioStyle) => {
    onUpdate({ ...portfolioData, template: tmpl });
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-100">
      {/* Top Application Bar */}
      <header className="h-14 border-b border-slate-800/90 bg-[#070b16]/90 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Landing Page</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(37,99,235,0.5)]">
              P
            </span>
            <span className="font-extrabold text-white text-sm hidden md:inline tracking-tight">
              Portfolia Editor
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-md font-medium">
            <Check className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Saved locally</span>
          </div>
        </div>

        {/* Center: Template & Preview Switcher */}
        <div className="flex items-center gap-2">
          {/* Template pills */}
          <div className="hidden lg:flex items-center bg-[#0d1428] border border-slate-800 p-0.5 rounded-xl text-xs font-semibold">
            {(['professional', 'creative', 'minimal'] as PortfolioStyle[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeTemplate(t)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  portfolioData.template === t
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Device viewport toggle */}
          <div className="hidden md:flex items-center bg-[#0d1428] border border-slate-800 p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg transition-colors ${
                previewDevice === 'desktop'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop Preview"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${
                previewDevice === 'mobile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Preview (Phone Frame)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEnterFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-[#0d1428] text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors shadow-sm"
            title="Open Clean Fullscreen View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish & Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            title="Reset Draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher (Edit vs Preview) */}
      <div className="md:hidden flex border-b border-slate-800 bg-[#070b16] px-4 py-2 gap-2">
        <button
          type="button"
          onClick={() => setMobileViewTab('edit')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors ${
            mobileViewTab === 'edit'
              ? 'bg-blue-600 text-white'
              : 'bg-[#0d1428] text-slate-400'
          }`}
        >
          Editor Controls
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('preview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors ${
            mobileViewTab === 'preview'
              ? 'bg-blue-600 text-white'
              : 'bg-[#0d1428] text-slate-400'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Split-Screen Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Navigation & Editor Forms */}
        <div
          className={`w-full md:w-[48%] lg:w-[43%] border-r border-slate-800 bg-[#070b16] overflow-y-auto ${
            mobileViewTab === 'edit' ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="p-4 sm:p-6 space-y-6 max-w-2xl mx-auto">
            {/* Completeness Coach Guidance Card */}
            {isCoachExpanded && (
              <CompletenessCoachPanel
                suggestions={completenessSuggestions}
                onNavigateSection={(id) => setActiveSection(id)}
              />
            )}

            {/* Section Tab Pills with Reorder / Hide */}
            <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-3 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Portfolio Sections
                </span>
                <span className="text-[10px] text-slate-500">
                  Click to edit • Use arrows to reorder
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {portfolioData.sections.map((sec, idx) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between group ${
                        isActive
                          ? 'border-blue-500 bg-blue-950/60 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)] ring-1 ring-blue-500'
                          : sec.visible
                          ? 'border-slate-800 bg-[#070b16] text-slate-300 hover:border-slate-700'
                          : 'border-slate-900 bg-black/40 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                          {sectionIcon(sec.id)}
                        </span>
                        <span className="truncate">{sec.label}</span>
                      </div>

                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => toggleSectionVisibility(sec.id, e)}
                          className="p-1 rounded text-slate-500 hover:text-slate-300"
                          title={sec.visible ? 'Hide section' : 'Show section'}
                        >
                          {sec.visible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => moveSection(idx, 'up', e)}
                          disabled={idx === 0}
                          className="p-0.5 rounded text-slate-500 hover:text-slate-300 disabled:opacity-20"
                          title="Move up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => moveSection(idx, 'down', e)}
                          disabled={idx === portfolioData.sections.length - 1}
                          className="p-0.5 rounded text-slate-500 hover:text-slate-300 disabled:opacity-20"
                          title="Move down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Section Form Box */}
            <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-5 sm:p-6 shadow-sm">
              {activeSection === 'intro' && (
                <IntroductionEditor
                  profile={portfolioData.profile}
                  portfolioData={portfolioData}
                  onChange={(profile) => onUpdate({ ...portfolioData, profile })}
                />
              )}

              {activeSection === 'projects' && (
                <ProjectsEditor
                  projects={portfolioData.projects}
                  onChange={(projects) => onUpdate({ ...portfolioData, projects })}
                />
              )}

              {activeSection === 'skills' && (
                <SkillsEditor
                  skills={portfolioData.skills}
                  onChange={(skills) => onUpdate({ ...portfolioData, skills })}
                />
              )}

              {activeSection === 'education' && (
                <EducationEditor
                  education={portfolioData.education}
                  onChange={(education) => onUpdate({ ...portfolioData, education })}
                />
              )}

              {activeSection === 'experience' && (
                <ExperienceEditor
                  experience={portfolioData.experience}
                  onChange={(experience) => onUpdate({ ...portfolioData, experience })}
                />
              )}

              {activeSection === 'certificates' && (
                <CertificatesEditor
                  certificates={portfolioData.certificates}
                  onChange={(certificates) => onUpdate({ ...portfolioData, certificates })}
                />
              )}

              {activeSection === 'activities' && (
                <ActivitiesEditor
                  activities={portfolioData.activities}
                  onChange={(activities) => onUpdate({ ...portfolioData, activities })}
                />
              )}

              {activeSection === 'contact' && (
                <ContactEditor
                  profile={portfolioData.profile}
                  onChange={(profile) => onUpdate({ ...portfolioData, profile })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Live Split-Screen Preview with dark canvas */}
        <div
          className={`flex-1 bg-[#040710] p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-start ${
            mobileViewTab === 'preview' ? 'block' : 'hidden md:flex'
          }`}
        >
          {/* Preview Header controls */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Live Interactive Preview
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                ({portfolioData.template} style)
              </span>
            </div>

            {/* Template switcher for preview */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 hidden sm:inline">Template:</span>
              {(['professional', 'creative', 'minimal'] as PortfolioStyle[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => changeTemplate(t)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                    portfolioData.template === t
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#0a0f1d] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Device Container Frame matching reference phone mockups */}
          {previewDevice === 'mobile' ? (
            /* Sleek Phone Frame */
            <div className="w-[375px] max-w-full rounded-[44px] border-[8px] border-slate-900 bg-black shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden my-4 ring-1 ring-blue-500/30 shrink-0">
              {/* Dynamic Island bar */}
              <div className="bg-black h-7 flex items-center justify-center">
                <div className="w-24 h-4 bg-slate-900 rounded-full" />
              </div>
              <div className="max-h-[660px] overflow-y-auto bg-white">
                <PortfolioRenderer data={portfolioData} />
              </div>
              {/* Bottom home indicator */}
              <div className="bg-black h-6 flex items-center justify-center">
                <div className="w-28 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>
          ) : (
            /* Desktop Canvas Frame */
            <div className="w-full max-w-4xl rounded-2xl border border-blue-500/30 bg-white shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden shrink-0">
              {/* Window bar */}
              <div className="bg-[#090e1c] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 pl-2">
                    portfolia.live/{portfolioData.profile.fullName ? portfolioData.profile.fullName.toLowerCase().replace(/\s+/g, '-') : 'my-portfolio'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onEnterFullscreen}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  <span>Fullscreen View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Rendered content */}
              <div className="min-h-[500px] bg-white">
                <PortfolioRenderer data={portfolioData} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        portfolioData={portfolioData}
        onEnterFullscreenPreview={onEnterFullscreen}
        onImportJson={(imported) => onUpdate(imported)}
      />

      {/* Reset Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={onReset}
      />
    </div>
  );
};
