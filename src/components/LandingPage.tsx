import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  FileText,
  Compass,
  Layers,
  Code2,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Laptop,
  Check,
  TrendingUp,
  Cpu,
  Shield,
  Smartphone,
  Activity,
  Award,
} from 'lucide-react';
import { SAMPLE_STUDENT_PORTFOLIO } from '../data/initialData';
import { PortfolioRenderer } from './Templates/PortfolioRenderer';

interface Props {
  onStartOnboarding: () => void;
  onExploreSample: () => void;
  hasExistingDraft: boolean;
  onResumeDraft: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onStartOnboarding,
  onExploreSample,
  hasExistingDraft,
  onResumeDraft,
}) => {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-blue-600/30 selection:text-blue-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Ambient Radial Lights matching the image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-indigo-900/10 to-transparent pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-96 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-96 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="w-full border-b border-slate-800/80 bg-[#060913]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-extrabold text-base shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/40">
              P
            </span>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Portfolia
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Student & Graduate Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasExistingDraft ? (
              <button
                type="button"
                onClick={onResumeDraft}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <span>Resume My Draft</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartOnboarding}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with dark aesthetic */}
      <section className="pt-16 pb-20 px-4 sm:px-6 border-b border-slate-800/80 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Built for students, recent grads & job seekers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Your experience <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]">
              deserves to be seen.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Turn your education, projects, skills and achievements into a professional portfolio—without coding or wondering what to include.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.99] border border-blue-400/40"
            >
              <span>Build My Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExploreSample}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0b1020]/90 border border-slate-700 hover:border-blue-500/60 text-slate-200 text-sm font-semibold hover:bg-[#0e162d] transition-all shadow-sm"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Explore an Example</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              No coding required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              100% honest student structure
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              AI Content Coach & Prompts
            </span>
          </div>
        </div>

        {/* Multi-Device Showcase matching the User's Image */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Mobile Mockup 1: Intro & Identity */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="rounded-[36px] border-4 border-slate-800 bg-[#080d1a] shadow-[0_0_30px_rgba(37,99,235,0.15)] p-4 space-y-4">
                <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto" />
                <div className="p-3 rounded-2xl bg-gradient-to-b from-blue-900/40 to-transparent border border-blue-500/20 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-blue-600/30 border-2 border-blue-400 mx-auto overflow-hidden">
                    <img src={SAMPLE_STUDENT_PORTFOLIO.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Maya Chen</h4>
                  <p className="text-[10px] text-blue-300 font-mono">UW Computer Science '27</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Competencies</span>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">React</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">TypeScript</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">Python</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 space-y-1">
                  <span className="font-bold text-cyan-400 block">✨ AI Coach Suggestion:</span>
                  <p className="italic">"Explain your personal role in developing the study group matching algorithm."</p>
                </div>
              </div>
            </div>

            {/* Center Desktop / Full Window Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-blue-500/30 bg-[#0a0f1e] shadow-[0_0_35px_rgba(37,99,235,0.2)] overflow-hidden">
                <div className="bg-[#070b16] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 pl-2">
                      portfolia.live/preview/maya-chen
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    Live Student Portfolio
                  </span>
                </div>

                {/* Live rendered sample */}
                <div className="max-h-[460px] overflow-y-auto bg-white text-slate-900">
                  <PortfolioRenderer data={SAMPLE_STUDENT_PORTFOLIO} />
                </div>
              </div>
            </div>

            {/* Right Mobile Mockup 2: Analytics & Project Highlights */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="rounded-[36px] border-4 border-slate-800 bg-[#080d1a] shadow-[0_0_30px_rgba(37,99,235,0.15)] p-4 space-y-4">
                <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-white">Completeness Coach</span>
                    <span className="text-cyan-400 font-mono">100% Ready</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-full" />
                  </div>
                </div>

                {/* Project Card */}
                <div className="p-3 rounded-2xl bg-[#0d1428] border border-blue-500/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">StudySync</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">Completed</span>
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-2">
                    A lightweight web app helping university students form peer study groups by schedule.
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-blue-400">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Peer tested with 120+ students</span>
                  </div>
                </div>

                {/* Certificate chip */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-200 font-semibold truncate">HackUW Sustainability</span>
                  </div>
                  <span className="text-blue-400 font-mono">PDF attached</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Benefits */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for students without 5 years of industry experience
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Standard portfolio builders assume you have corporate client rosters and senior titles. Portfolia is purpose-built for learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="rounded-2xl border border-blue-500/20 bg-[#090e1c] p-8 shadow-[0_0_20px_rgba(37,99,235,0.08)] hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                1. Know what to include.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Guided forms ask beginner-friendly questions about your coursework, semester projects, tools you are learning, and student clubs.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800 mt-6 text-xs text-blue-400 font-semibold">
              No previous internships required
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="rounded-2xl border border-blue-500/20 bg-[#090e1c] p-8 shadow-[0_0_20px_rgba(37,99,235,0.08)] hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                2. AI Writing Assistant & Content Coach.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Analyzes existing input and suggests follow-up questions, missing technical hurdles, and 1-click starter phrases without fabricating facts.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800 mt-6 text-xs text-cyan-400 font-semibold">
              Contextual elaboration suggestions
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="rounded-2xl border border-blue-500/20 bg-[#090e1c] p-8 shadow-[0_0_20px_rgba(37,99,235,0.08)] hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                3. File Attachments & Clean Templates.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Attach PDFs, document scans, and images directly to certificates. Switch between Professional, Creative, and Minimal templates in real time.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-800 mt-6 text-xs text-indigo-400 font-semibold">
              All document formats supported
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Explanation */}
      <section className="bg-[#04070e] border-y border-slate-800/80 py-18 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Three simple steps from start to portfolio
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              A frictionless workflow that respects your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#090e1c] rounded-2xl border border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-white text-base">Tell us about yourself</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Answer simple questions about your studies, your current goals, and what you’ve built so far.
              </p>
            </div>

            <div className="bg-[#090e1c] rounded-2xl border border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-white text-base">Build your portfolio</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Use the AI Content Coach to expand your contributions, add certificate files (+add icon), and polish your summaries.
              </p>
            </div>

            <div className="bg-[#090e1c] rounded-2xl border border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-white text-base">Preview and publish</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Inspect desktop and mobile simulated viewports, download JSON backups, or print a clean PDF.
              </p>
            </div>
          </div>

          <div className="text-center pt-10">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <span>Start Building Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060913] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              P
            </span>
            <span className="font-bold text-white">Portfolia</span>
            <span>— Your journey. Your skills. Your story. One portfolio.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Client-side local drafts</span>
            <span>All file attachments</span>
            <span>AI Content Assistant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
