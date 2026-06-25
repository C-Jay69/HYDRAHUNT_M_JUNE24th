import React from 'react';
import { ResumeVersion } from '@/types/hydranhunt';

interface TemplateProps {
  data: ResumeVersion;
  className?: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, className }) => (
  <div className={`p-8 bg-white text-slate-900 font-sans ${className ?? ''}`}>
    <div className="flex justify-between items-start border-b-4 border-blue-600 pb-6 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{data.fullName}</h1>
        <p className="text-lg text-blue-600 font-medium">{data.summary?.split('.')[0]}</p>
      </div>
      <div className="text-right text-sm text-slate-500">
        <p>{data.email}</p>
        <p>{data.phone}</p>
        <p>{data.location}</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <section className="mb-8">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Experience</h2>
          {(data.experience ?? []).map((exp, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-800">{exp.title ?? exp.role}</h3>
                <span className="text-xs text-slate-400">
                  {exp.startDate} &ndash; {exp.endDate}
                </span>
              </div>
              <div className="text-sm text-slate-600 font-medium mb-2">
                {exp.company}
                {exp.location ? ` | ${exp.location}` : ''}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </section>
      </div>

      <div className="col-span-1 space-y-8">
        <section>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Education</h2>
          {(data.education ?? []).map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="text-sm font-bold text-slate-800">{edu.school}</div>
              <div className="text-xs text-slate-500">{edu.degree}</div>
              <div className="text-xs text-slate-400">{edu.endDate}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(data.skills ?? []).map((skill, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);
