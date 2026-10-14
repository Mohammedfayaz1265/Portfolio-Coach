import React from 'react';
import { PortfolioData } from '../../types/portfolio';
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
  isPublic?: boolean;
}

export const ProfessionalTemplate: React.FC<Props> = ({ data }) => {
  const { profile, education, experience, projects, skills, certificates, activities, sections } = data;

  const isVisible = (id: string) => {
    const config = sections.find(s => s.id === id);
    return config ? config.visible : true;
  };

  const stageBadge = (stage: string) => {
    switch (stage) {
      case 'demonstrated':
        return <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">Demonstrated</span>;
      case 'practicing':
        return <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded">Practicing</span>;
      default:
        return <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">Learning</span>;
    }
  };

  return (
    <div className="bg-white text-slate-800 min-h-full font-sans antialiased selection:bg-indigo-100">
      {/* Header / Intro */}
      {isVisible('intro') && (
        <header className="border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 to-white pt-10 pb-8 px-6 md:px-12">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'Profile'}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-indigo-50 border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-3xl shadow-sm shrink-0">
                {profile.fullName ? profile.fullName.charAt(0) : 'P'}
              </div>
            )}

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile.fullName || 'Your Name'}
                </h1>
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.location}
                  </span>
                )}
              </div>

              <p className="text-sm md:text-base text-indigo-700 font-medium leading-snug">
                {profile.headline || 'Add your professional headline in the editor'}
              </p>

              {profile.bio && (
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
                  {profile.bio}
                </p>
              )}

              {/* Social and Contact Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-10 space-y-12">
        {/* Featured Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Featured Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {projects.map((proj) => (
                <article
                  key={proj.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-indigo-200 transition-all hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      {proj.title}
                      {proj.status === 'prototype' && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Prototype
                        </span>
                      )}
                      {proj.status === 'in_progress' && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          In Progress
                        </span>
                      )}
                    </h3>

                    <div className="flex items-center gap-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 font-medium px-2 py-1 rounded bg-slate-50 border border-slate-200"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-800 font-medium px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {proj.tagline && (
                    <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
                      {proj.tagline}
                    </p>
                  )}

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* Personal Contribution Highlight */}
                  {proj.personalContribution && (
                    <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 mb-4 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 block mb-1">
                        Personal Contribution & Role:
                      </span>
                      <p>{proj.personalContribution}</p>
                    </div>
                  )}

                  {/* Working Features */}
                  {proj.workingFeatures && proj.workingFeatures.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Working Features:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {proj.workingFeatures.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech stack tags */}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {isVisible('skills') && (
          <section>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Skills & Technical Competencies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.programming.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Languages & Core Development
                  </h3>
                  <div className="space-y-2">
                    {skills.programming.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        {stageBadge(s.stage)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.tools.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Tools, Frameworks & Software
                  </h3>
                  <div className="space-y-2">
                    {skills.tools.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        {stageBadge(s.stage)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.analytical.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Analytical & Problem Solving
                  </h3>
                  <div className="space-y-2">
                    {skills.analytical.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        {stageBadge(s.stage)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.communication.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Teamwork & Communication
                  </h3>
                  <div className="space-y-2">
                    {skills.communication.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        {stageBadge(s.stage)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Education */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Education
              </h2>
            </div>

            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-indigo-500 pl-4 py-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {edu.institution}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.startYear} — {edu.endYear}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-indigo-700 font-medium mb-1">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    {edu.grade && <span className="ml-2 text-slate-600 font-normal">({edu.grade})</span>}
                  </p>

                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                        Relevant Coursework:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.coursework.map((course, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] text-slate-700 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience (Shown only if added) */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Experience & Roles
              </h2>
            </div>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-indigo-400 pl-4 py-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {exp.role} <span className="text-slate-400 font-normal">at</span> {exp.organization}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  {exp.responsibilities && (
                    <p className="text-xs md:text-sm text-slate-700 mb-2 leading-relaxed">
                      {exp.responsibilities}
                    </p>
                  )}

                  {exp.contributions && (
                    <div className="text-xs text-slate-600 mb-1.5">
                      <span className="font-semibold text-slate-800">Contributions: </span>
                      {exp.contributions}
                    </div>
                  )}

                  {exp.outcomes && (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Outcomes: </span>
                      {exp.outcomes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates & Achievements */}
        {isVisible('certificates') && certificates.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Certificates & Achievements
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{cert.title}</h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {cert.category}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mb-1.5">
                    {cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ''}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {cert.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {cert.attachment && (
                      <a
                        href={cert.attachment.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View {cert.attachment.isImage ? 'Certificate Image' : 'Document'} ({cert.attachment.size})</span>
                      </a>
                    )}
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-medium"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities & Leadership */}
        {isVisible('activities') && activities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                Activities & Leadership
              </h2>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {act.title} — <span className="text-slate-600 font-normal">{act.organization}</span>
                    </h3>
                    <span className="text-xs text-slate-500">{act.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>
                  {act.link && (
                    <a
                      href={act.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-medium mt-2"
                    >
                      <span>Learn more</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50 py-6 px-6 text-center text-xs text-slate-500">
        <p>Built honestly with Portfolia • Ready for student & graduate opportunities</p>
      </footer>
    </div>
  );
};
