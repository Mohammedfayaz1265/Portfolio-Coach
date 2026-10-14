import React from 'react';
import { PortfolioData } from '../../types/portfolio';
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Globe,
  Sparkles,
  Layers,
  ArrowUpRight,
  GraduationCap,
  Award,
  HeartHandshake,
} from 'lucide-react';

interface Props {
  data: PortfolioData;
  isPublic?: boolean;
}

export const CreativeTemplate: React.FC<Props> = ({ data }) => {
  const { profile, education, experience, projects, skills, certificates, activities, sections } = data;

  const isVisible = (id: string) => {
    const config = sections.find(s => s.id === id);
    return config ? config.visible : true;
  };

  return (
    <div className="bg-[#faf8f5] text-stone-900 min-h-full font-sans antialiased selection:bg-amber-100">
      {/* Editorial Header */}
      {isVisible('intro') && (
        <header className="px-6 md:px-12 pt-14 pb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Creative Portfolio</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-md shrink-0"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-amber-200/70 border-4 border-white shadow-md flex items-center justify-center font-bold text-4xl text-amber-900 shrink-0">
                {profile.fullName ? profile.fullName.charAt(0) : 'P'}
              </div>
            )}

            <div className="space-y-3 flex-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-stone-900">
                {profile.fullName || 'Your Name'}
              </h1>

              <p className="text-base md:text-lg font-medium text-stone-700 leading-snug">
                {profile.headline || 'Creative builder, student & maker'}
              </p>

              {profile.bio && (
                <p className="text-sm text-stone-600 leading-relaxed max-w-2xl font-normal">
                  {profile.bio}
                </p>
              )}

              {/* Career tags */}
              {profile.careerInterests && profile.careerInterests.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.careerInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-200/60 text-stone-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {/* Social links */}
              <div className="flex flex-wrap gap-3 pt-3 text-xs">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-700" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs font-medium"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs font-medium"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 transition-colors shadow-2xs font-medium"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 pb-16 space-y-14">
        {/* Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6 pb-2 border-b-2 border-stone-300">
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                Featured Creations & Projects
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-white border border-stone-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {proj.imageUrl && (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-stone-100 border border-stone-100">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-stone-900">
                        {proj.title}
                      </h3>
                      {proj.status === 'prototype' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          Prototype
                        </span>
                      )}
                    </div>

                    {proj.tagline && (
                      <p className="text-xs text-stone-600 font-medium mb-3">
                        {proj.tagline}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {proj.description}
                    </p>

                    {proj.personalContribution && (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 mb-4 text-xs text-stone-800">
                        <span className="font-bold text-amber-900 block mb-0.5">My Role:</span>
                        {proj.personalContribution}
                      </div>
                    )}
                  </div>

                  <div>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                        >
                          <span>Explore Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {isVisible('skills') && (
          <section>
            <div className="mb-6 pb-2 border-b-2 border-stone-300">
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                Skillsets & Toolkit
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(skills).map(([category, items]) => {
                if (!items || items.length === 0) return null;
                const catLabels: Record<string, string> = {
                  programming: 'Coding & Languages',
                  tools: 'Tools & Software',
                  analytical: 'Analytical Mindset',
                  communication: 'Collaboration',
                  creative: 'Design & Visual',
                  languages: 'Spoken Languages',
                };

                return (
                  <div key={category} className="rounded-2xl bg-white border border-stone-200 p-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-3">
                      {catLabels[category] || category}
                    </h3>
                    <ul className="space-y-1.5 text-xs">
                      {items.map((it: any, idx: number) => (
                        <li key={idx} className="flex items-center justify-between text-stone-700">
                          <span>{it.name}</span>
                          <span className="text-[10px] text-stone-400 capitalize">
                            {it.stage}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {isVisible('education') && education.length > 0 && (
          <section>
            <div className="mb-6 pb-2 border-b-2 border-stone-300 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                Education
              </h2>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="rounded-2xl bg-white border border-stone-200 p-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-1">
                    <h3 className="text-base font-bold text-stone-900">{edu.institution}</h3>
                    <span className="text-xs font-medium text-stone-500">
                      {edu.startYear} — {edu.endYear}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-800 mb-2">
                    {edu.degree} in {edu.fieldOfStudy} {edu.grade && `• ${edu.grade}`}
                  </p>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {edu.coursework.map((c, i) => (
                        <span key={i} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience if present */}
        {isVisible('experience') && experience.length > 0 && (
          <section>
            <div className="mb-6 pb-2 border-b-2 border-stone-300">
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                Work & Contributions
              </h2>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="rounded-2xl bg-white border border-stone-200 p-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-1">
                    <h3 className="text-base font-bold text-stone-900">
                      {exp.role} <span className="font-normal text-stone-500">at</span> {exp.organization}
                    </h3>
                    <span className="text-xs text-stone-500">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">{exp.responsibilities}</p>
                  {exp.contributions && (
                    <p className="text-xs text-stone-700 font-medium mt-1.5">
                      <span className="text-stone-900 font-bold">Key Contribution: </span>
                      {exp.contributions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates & Achievements */}
        {isVisible('certificates') && certificates.length > 0 && (
          <section>
            <div className="mb-6 pb-2 border-b-2 border-stone-300 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                Honors & Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="rounded-2xl bg-white border border-stone-200 p-4">
                  <h3 className="text-sm font-bold text-stone-900">{cert.title}</h3>
                  <p className="text-xs text-amber-800 font-semibold mb-1">
                    {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed mb-2">{cert.description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {cert.attachment && (
                      <a
                        href={cert.attachment.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View {cert.attachment.isImage ? 'Certificate' : 'Document'} ({cert.attachment.size})</span>
                      </a>
                    )}
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-bold hover:underline"
                      >
                        <span>View Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities */}
        {isVisible('activities') && activities.length > 0 && (
          <section>
            <div className="mb-6 pb-2 border-b-2 border-stone-300 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                Community & Leadership
              </h2>
            </div>

            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="rounded-2xl bg-white border border-stone-200 p-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold text-stone-900">
                      {act.title} • <span className="text-stone-500 font-normal">{act.organization}</span>
                    </h3>
                    <span className="text-xs text-stone-400">{act.period}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{act.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
        Created with Portfolia • Ready for creative & technical discovery
      </footer>
    </div>
  );
};
