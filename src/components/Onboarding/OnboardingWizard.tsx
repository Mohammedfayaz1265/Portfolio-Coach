import React, { useState } from 'react';
import {
  SituationType,
  GoalType,
  BackgroundItem,
  PortfolioStyle,
  PortfolioData,
} from '../../types/portfolio';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  Palette,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  FileCheck2,
} from 'lucide-react';

interface Props {
  portfolioData: PortfolioData;
  onUpdate: (data: PortfolioData) => void;
  onComplete: () => void;
  onCancelToLanding?: () => void;
}

export const OnboardingWizard: React.FC<Props> = ({
  portfolioData,
  onUpdate,
  onComplete,
  onCancelToLanding,
}) => {
  const [step, setStep] = useState<number>(portfolioData.onboarding.step || 1);
  const [situation, setSituation] = useState<SituationType>(portfolioData.onboarding.situation);
  const [goal, setGoal] = useState<GoalType>(portfolioData.onboarding.goal);
  const [background, setBackground] = useState<BackgroundItem[]>(portfolioData.onboarding.background || []);
  const [preferredStyle, setPreferredStyle] = useState<PortfolioStyle>(portfolioData.onboarding.preferredStyle);

  const saveCurrentProgress = (nextStep: number) => {
    const updated: PortfolioData = {
      ...portfolioData,
      template: preferredStyle,
      onboarding: {
        ...portfolioData.onboarding,
        step: nextStep,
        situation,
        goal,
        background,
        preferredStyle,
      },
    };
    onUpdate(updated);
  };

  const handleNext = () => {
    if (step < 4) {
      const next = step + 1;
      setStep(next);
      saveCurrentProgress(next);
    } else {
      let finalStyle = preferredStyle;
      if (!finalStyle) {
        if (goal === 'creative') finalStyle = 'creative';
        else if (goal === 'grad_school') finalStyle = 'minimal';
        else finalStyle = 'professional';
      }

      const updated: PortfolioData = {
        ...portfolioData,
        template: finalStyle,
        onboarding: {
          completed: true,
          step: 4,
          situation,
          goal,
          background,
          preferredStyle: finalStyle,
        },
      };
      onUpdate(updated);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prev = step - 1;
      setStep(prev);
      saveCurrentProgress(prev);
    } else if (onCancelToLanding) {
      onCancelToLanding();
    }
  };

  const toggleBackground = (item: BackgroundItem) => {
    if (item === 'just_started') {
      setBackground(['just_started']);
      return;
    }

    const filtered = background.filter(b => b !== 'just_started');
    if (filtered.includes(item)) {
      setBackground(filtered.filter(b => b !== item));
    } else {
      setBackground([...filtered, item]);
    }
  };

  const situationOptions: { id: SituationType; label: string; desc: string }[] = [
    { id: 'school_student', label: 'School student', desc: 'High school or secondary school explorer' },
    { id: 'college_student', label: 'College or university student', desc: 'Undergraduate or graduate coursework' },
    { id: 'recent_grad', label: 'Recent graduate', desc: 'Graduated in the past 1-2 years' },
    { id: 'professional', label: 'Working professional', desc: 'Looking to organize achievements' },
    { id: 'creator', label: 'Freelancer or creator', desc: 'Independent designer, editor, or maker' },
    { id: 'other', label: 'Other / Lifelong learner', desc: 'Transitioning careers or exploring' },
  ];

  const goalOptions: { id: GoalType; label: string; desc: string }[] = [
    { id: 'internship', label: 'Find an internship', desc: 'Targeting summer or semester internships' },
    { id: 'job', label: 'Apply for a full-time job', desc: 'Entry-level or graduate roles' },
    { id: 'college_projects', label: 'Showcase college projects', desc: 'Classroom labs, capstones, and hacks' },
    { id: 'freelance', label: 'Find freelance clients', desc: 'Client work, contract builds, and services' },
    { id: 'grad_school', label: 'Apply for higher education', desc: 'Master’s, PhD, or academic programs' },
    { id: 'creative', label: 'Showcase creative work', desc: 'Design, video, writing, or audiovisual' },
    { id: 'brand', label: 'Build a personal brand', desc: 'Share your learning journey publicly' },
  ];

  const backgroundOptions: { id: BackgroundItem; label: string }[] = [
    { id: 'academic_projects', label: 'Academic or personal projects' },
    { id: 'internship', label: 'Internship or employment' },
    { id: 'coursework', label: 'Education and coursework' },
    { id: 'certificates', label: 'Certificates or achievements' },
    { id: 'creative_work', label: 'Video editing, design or creative work' },
    { id: 'hackathons', label: 'Hackathons and competitions' },
    { id: 'volunteering', label: 'Volunteering, clubs or leadership' },
    { id: 'research', label: 'Research, writing or publications' },
    { id: 'just_started', label: 'I am just getting started' },
  ];

  const styleOptions: { id: PortfolioStyle | 'auto'; label: string; desc: string }[] = [
    {
      id: 'professional',
      label: 'Clean and professional',
      desc: 'Structured timeline, crisp cards, ideal for internships & corporate roles.',
    },
    {
      id: 'creative',
      label: 'Modern and creative',
      desc: 'Warm editorial layout, expressive visual badges, ideal for designers and builders.',
    },
    {
      id: 'minimal',
      label: 'Minimal',
      desc: 'Elegant typography, distraction-free monochrome, pure content clarity.',
    },
    {
      id: 'auto',
      label: 'Recommend a style for me',
      desc: 'We will automatically adapt the presentation based on your career goal.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

      {/* Top Bar with Progress */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30">
              P
            </span>
            <span className="font-extrabold text-white tracking-tight text-lg">
              Portfolia
            </span>
          </div>

          <div className="text-xs font-semibold text-blue-400 font-mono">
            Step {step} of 4
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Card */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="bg-[#0a0f1d] rounded-2xl border border-blue-500/25 shadow-[0_0_30px_rgba(37,99,235,0.12)] p-6 sm:p-10 transition-all">
          {/* Step 1: Situation */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Your Current Stage</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  What is your current situation?
                </h2>
                <p className="text-sm text-slate-400">
                  This helps us highlight what matters most, so you never feel pressured to have 5 years of experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {situationOptions.map((opt) => {
                  const isSelected = situation === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSituation(opt.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/60 ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'border-slate-800 hover:border-slate-700 bg-[#070b16] hover:bg-[#0d1428]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-white">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </div>
                      <span className="text-xs text-slate-400">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Your Objective</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  What is your main goal?
                </h2>
                <p className="text-sm text-slate-400">
                  We customize section priorities so recruiters or reviewers see your strongest qualifications first.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {goalOptions.map((opt) => {
                  const isSelected = goal === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGoal(opt.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/60 ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'border-slate-800 hover:border-slate-700 bg-[#070b16] hover:bg-[#0d1428]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-white">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </div>
                      <span className="text-xs text-slate-400">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Background */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Choose Everything That Applies</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  What have you done so far?
                </h2>
                <p className="text-sm text-slate-400">
                  Select as many as apply. If you have no employment experience yet, that is 100% fine!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {backgroundOptions.map((opt) => {
                  const isSelected = background.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleBackground(opt.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/60 ring-1 ring-blue-500 text-white font-semibold shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                          : 'border-slate-800 hover:border-slate-700 bg-[#070b16] text-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{opt.label}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ml-2 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-700 bg-[#060a14]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Style */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Visual Style</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  What style do you prefer?
                </h2>
                <p className="text-sm text-slate-400">
                  You can easily change templates at any time with one click without losing any written content.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {styleOptions.map((opt) => {
                  const isSelected =
                    opt.id === 'auto'
                      ? preferredStyle === 'professional' && goal !== 'creative'
                      : preferredStyle === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        if (opt.id === 'auto') {
                          if (goal === 'creative') setPreferredStyle('creative');
                          else if (goal === 'grad_school') setPreferredStyle('minimal');
                          else setPreferredStyle('professional');
                        } else {
                          setPreferredStyle(opt.id);
                        }
                      }}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/60 ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'border-slate-800 hover:border-slate-700 bg-[#070b16]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-white mb-1 flex items-center gap-2">
                          {opt.label}
                          {opt.id === 'auto' && (
                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ml-3 ${
                          isSelected ? 'border-blue-400 bg-blue-600' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? 'Back to Overview' : 'Previous'}</span>
            </button>

            <div className="flex items-center gap-3">
              {step === 3 && background.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setBackground(['just_started']);
                    handleNext();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Skip for now
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                <span>{step === 4 ? 'Create My Portfolio' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful reassurance */}
      <div className="max-w-2xl mx-auto w-full text-center text-xs text-slate-500 pt-6">
        No technical skills or previous portfolio required • Editable anytime
      </div>
    </div>
  );
};
