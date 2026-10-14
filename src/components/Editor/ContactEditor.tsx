import React from 'react';
import { PersonalProfile } from '../../types/portfolio';
import { Mail, Github, Linkedin, Globe, Twitter, Share2, ShieldCheck } from 'lucide-react';

interface Props {
  profile: PersonalProfile;
  onChange: (updated: PersonalProfile) => void;
}

export const ContactEditor: React.FC<Props> = ({ profile, onChange }) => {
  const updateEmail = (email: string) => {
    onChange({
      ...profile,
      email,
    });
  };

  const updateSocialLink = (network: keyof typeof profile.socialLinks, url: string) => {
    onChange({
      ...profile,
      socialLinks: {
        ...profile.socialLinks,
        [network]: url,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-900">
          My Contact Details & Links
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Allow recruiters, collaborators, and professors to reach you. All fields are optional.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={profile.email || ''}
              onChange={(e) => updateEmail(e.target.value)}
              placeholder="e.g. yourname@university.edu or student.work@gmail.com"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Use your student or professional email.
          </p>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub Profile URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={profile.socialLinks?.github || ''}
              onChange={(e) => updateSocialLink('github', e.target.value)}
              placeholder="https://github.com/your-username"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            LinkedIn Profile URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={profile.socialLinks?.linkedin || ''}
              onChange={(e) => updateSocialLink('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/your-profile"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Linkedin className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Personal Website */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Personal Website or Blog (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              value={profile.socialLinks?.website || ''}
              onChange={(e) => updateSocialLink('website', e.target.value)}
              placeholder="https://yourname.me"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Globe className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Twitter / X */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            X / Twitter Profile (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              value={profile.socialLinks?.twitter || ''}
              onChange={(e) => updateSocialLink('twitter', e.target.value)}
              placeholder="https://x.com/yourhandle"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Twitter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Dribbble / Portfolio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Design or Creative Portfolio Link (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              value={profile.socialLinks?.dribbble || ''}
              onChange={(e) => updateSocialLink('dribbble', e.target.value)}
              placeholder="https://dribbble.com/yourhandle or Figma link"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Share2 className="w-4 h-4 text-pink-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Privacy Notice: </span>
          We never ask for account passwords or collect home addresses or birthdates. Only the links you explicitly enter here will be displayed on your portfolio.
        </div>
      </div>
    </div>
  );
};
