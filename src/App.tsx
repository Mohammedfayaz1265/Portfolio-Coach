import React, { useState, useEffect } from 'react';
import {
  PortfolioData,
  PortfolioStyle,
} from './types/portfolio';
import {
  EMPTY_PORTFOLIO,
  SAMPLE_STUDENT_PORTFOLIO,
  loadSavedPortfolio,
  savePortfolioToStorage,
  clearPortfolioStorage,
} from './data/initialData';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { EditorDashboard } from './components/Editor/EditorDashboard';
import { FullscreenPreview } from './components/FullscreenPreview';
import { PublishModal } from './components/Editor/PublishModal';

type AppView = 'landing' | 'onboarding' | 'editor' | 'fullscreen_preview';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const saved = loadSavedPortfolio();
    return saved || EMPTY_PORTFOLIO;
  });

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Auto-save on data change
  useEffect(() => {
    savePortfolioToStorage(portfolioData);
  }, [portfolioData]);

  const handleStartOnboarding = () => {
    if (portfolioData.onboarding.completed) {
      setView('editor');
    } else {
      setView('onboarding');
    }
  };

  const handleExploreSample = () => {
    setPortfolioData(SAMPLE_STUDENT_PORTFOLIO);
    setView('editor');
  };

  const handleResetDraft = () => {
    clearPortfolioStorage();
    setPortfolioData(EMPTY_PORTFOLIO);
    setView('landing');
  };

  const hasDraftContent = Boolean(
    portfolioData.profile.fullName ||
    portfolioData.projects.length > 0 ||
    portfolioData.education.length > 0 ||
    portfolioData.onboarding.completed
  );

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0f172a] font-sans antialiased">
      {view === 'landing' && (
        <LandingPage
          onStartOnboarding={handleStartOnboarding}
          onExploreSample={handleExploreSample}
          hasExistingDraft={hasDraftContent}
          onResumeDraft={() => setView('editor')}
        />
      )}

      {view === 'onboarding' && (
        <OnboardingWizard
          portfolioData={portfolioData}
          onUpdate={(updated) => setPortfolioData(updated)}
          onComplete={() => setView('editor')}
          onCancelToLanding={() => setView('landing')}
        />
      )}

      {view === 'editor' && (
        <EditorDashboard
          portfolioData={portfolioData}
          onUpdate={(updated) => setPortfolioData(updated)}
          onReset={handleResetDraft}
          onBackToLanding={() => setView('landing')}
          onEnterFullscreen={() => setView('fullscreen_preview')}
        />
      )}

      {view === 'fullscreen_preview' && (
        <FullscreenPreview
          portfolioData={portfolioData}
          onBackToEdit={() => setView('editor')}
          onUpdateTemplate={(template: PortfolioStyle) =>
            setPortfolioData({ ...portfolioData, template })
          }
          onOpenPublish={() => setIsPublishModalOpen(true)}
        />
      )}

      {/* Floating publish modal for fullscreen view */}
      {view === 'fullscreen_preview' && (
        <PublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          portfolioData={portfolioData}
          onEnterFullscreenPreview={() => {}}
          onImportJson={(imported) => setPortfolioData(imported)}
        />
      )}
    </div>
  );
}
