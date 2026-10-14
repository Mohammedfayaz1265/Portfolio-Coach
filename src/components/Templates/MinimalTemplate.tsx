import React from 'react';
import { PortfolioData } from '../../types/portfolio';
import { ExternalLink, Github, Linkedin, Mail, Globe } from 'lucide-react';

interface Props {
  data: PortfolioData;
  isPublic?: boolean;
}

export const MinimalTemplate: React.FC<Props> = ({ data }) => {
  const { profile, education, experience, projects, skills, certificates, activities, sections } = data;

  const isVisible = (id: string) => {
    const config = sections.find(s => s.id === id);
    return config ? config.visible : true;
  };

  return (
    <div className="bg-white text-neutral-900 min-h-full font-sans antialiased selection:bg-neutral-200">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 space-y-16">
        {/* Header */}
        {isVisible('intro') && (
          <header className="space-y-4 border-b border-neutral-200 pb-10">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 font-serif">
                {profile.fullName || 'Your Name'}
              </h1>
              <p className="text-sm md:text-base text-neutral-600 font-normal">
                {profile.headline || 'Student & Aspiring Builder'}
              </p>
            </div>

            {profile.bio && (
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed max-w-2xl pt-2">
                {profile.bio}
              </p>
            )}

            {/* Contact links */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-neutral-600">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-black underline underline-offset-4 decoration-neutral-300"
                >
                  {profile.email}
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black underline underline-offset-4 decoration-neutral-300"
                >
                  GitHub
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black underline underline-offset-4 decoration-neutral-300"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black underline underline-offset-4 decoration-neutral-300"
                >
                  Website
                </a>
              )}
              {profile.location && (
                <span className="text-neutral-400">
                  {profile.location}
                </span>
              )}
            </div>
          </header>
        )}

        {/* Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Selected Work
            </h2>

            <div className="space-y-10">
              {projects.map((proj) => (
                <article key={proj.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                      {proj.title}
                      {proj.status === 'prototype' && (
                        <span className="text-[10px] text-neutral-500 font-mono">
                          [prototype]
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-black hover:underline"
                        >
                          Source
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-black font-medium hover:underline flex items-center gap-0.5"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {proj.tagline && (
                    <p className="text-xs text-neutral-600 font-medium">
                      {proj.tagline}
                    </p>
                  )}

                  <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.personalContribution && (
                    <p className="text-xs text-neutral-500">
                      <span className="text-neutral-800 font-medium">Contribution: </span>
                      {proj.personalContribution}
                    </p>
                  )}

                  {proj.techStack && proj.techStack.length > 0 && (
                    <p className="text-xs text-neutral-400 font-mono pt-1">
                      {proj.techStack.join(' / ')}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {isVisible('education') && education.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Education
            </h2>

            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-neutral-900">{edu.institution}</h3>
                    <span className="text-xs text-neutral-400 font-mono">
                      {edu.startYear} — {edu.endYear}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    {edu.degree} in {edu.fieldOfStudy} {edu.grade && `(${edu.grade})`}
                  </p>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <p className="text-xs text-neutral-500 pt-1">
                      Coursework: {edu.coursework.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience if any */}
        {isVisible('experience') && experience.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {exp.role}, {exp.organization}
                    </h3>
                    <span className="text-xs text-neutral-400 font-mono">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">{exp.responsibilities}</p>
                  {exp.contributions && (
                    <p className="text-xs text-neutral-500">
                      Impact: {exp.contributions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {isVisible('skills') && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Competencies
            </h2>

            <div className="space-y-3 text-xs">
              {skills.programming.length > 0 && (
                <div>
                  <span className="text-neutral-500 font-mono block mb-1">Languages:</span>
                  <p className="text-neutral-800">
                    {skills.programming.map(s => s.name).join(' • ')}
                  </p>
                </div>
              )}
              {skills.tools.length > 0 && (
                <div>
                  <span className="text-neutral-500 font-mono block mb-1">Tools & Frameworks:</span>
                  <p className="text-neutral-800">
                    {skills.tools.map(s => s.name).join(' • ')}
                  </p>
                </div>
              )}
              {skills.analytical.length > 0 && (
                <div>
                  <span className="text-neutral-500 font-mono block mb-1">Analytical:</span>
                  <p className="text-neutral-800">
                    {skills.analytical.map(s => s.name).join(' • ')}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Certificates & Achievements */}
        {isVisible('certificates') && certificates.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Certifications & Honors
            </h2>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-900">{cert.title}</span>
                    <span className="text-neutral-400 font-mono">{cert.issueDate}</span>
                  </div>
                  <p className="text-neutral-500">{cert.issuer} — {cert.description}</p>
                  {cert.attachment && (
                    <a
                      href={cert.attachment.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-700 underline underline-offset-2 hover:text-black font-medium mt-1 inline-block"
                    >
                      [View {cert.attachment.name} ({cert.attachment.size})]
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities */}
        {isVisible('activities') && activities.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Leadership & Community
            </h2>

            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="text-xs space-y-0.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-900">{act.title}, {act.organization}</span>
                    <span className="text-neutral-400 font-mono">{act.period}</span>
                  </div>
                  <p className="text-neutral-600">{act.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="pt-8 border-t border-neutral-100 text-xs text-neutral-400 flex justify-between items-center">
          <span>Portfolia</span>
          <span>Authentic Student Portfolio</span>
        </footer>
      </div>
    </div>
  );
};
