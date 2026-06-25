import React from 'react';
import { ResumeVersion } from '@/types/hydranhunt';

interface TemplateProps {
  data: ResumeVersion;
  className?: string;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data, className }) => (
  <div className={`p-8 bg-white text-slate-900 font-mono ${className ?? ''}`}>
    <div className="border-l-8 border-slate-800 pl-6 mb-8">
      <h1 className="text-3xl font-bold">{data.fullName}</h1>
      <div className="text-sm text-slate-500 mt-1">
        {/* Separator-joined contact line — avoids JSX comment-in-children lint error */}
        {[data.email, data.phone, data.location].filter(Boolean).join(' // ')}
      </div>
    </div>

    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase bg-slate-800 text-white px-2 py-1 mb-4">Technical Stack</h2>
      <div className="grid grid-cols-2 gap-4">
        {Array.from(new Set((data.skills ?? []).map((s) => s.category))).map((cat) => (
          <div key={cat} className="text-sm">
            <span className="font-bold text-slate-700">{cat}: </span>
            <span className="text-slate-600">
              {(data.skills ?? [])
                .filter((s) => s.category === cat)
                .map((s) => s.name)
                .join(', ')}
            </span>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase bg-slate-800 text-white px-2 py-1 mb-4">Experience</h2>
      {(data.experience ?? []).map((exp, i) => (
        <div key={i} className="mb-6">
          <div className="flex justify-between items-baseline mb-1">
            {/* Use `title` (normalized schema field) with `company` */}
            <span className="font-bold">
              {exp.title ?? (exp as any).role} @ {exp.company}
            </span>
            <span className="text-xs text-slate-500">
              {exp.startDate} - {exp.endDate}
            </span>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-line">{exp.description}</p>
        </div>
      ))}
    </section>

    <section>
      <h2 className="text-sm font-bold uppercase bg-slate-800 text-white px-2 py-1 mb-4">Education</h2>
      {(data.education ?? []).map((edu, i) => (
        <div key={i} className="mb-2 text-sm">
          <span className="font-bold">{edu.school}</span> -{' '}
          {edu.degree}
          {edu.field ? ` (${edu.field})` : ''}
          {edu.endDate ? ` — ${edu.endDate}` : ''}
        </div>
      ))}
    </section>
  </div>
);
