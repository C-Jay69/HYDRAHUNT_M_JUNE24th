import React from 'react';
import { ResumeVersion } from '@/types/hydranhunt';

interface TemplateProps {
  data: ResumeVersion;
  className?: string;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, className }) => (
  <div className={`p-8 bg-white text-gray-900 font-serif leading-relaxed ${className ?? ''}`}>
    <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
      <h1 className="text-3xl font-bold uppercase tracking-tight">{data.fullName}</h1>
      <div className="text-sm text-gray-600 mt-2">
        {[data.email, data.phone, data.location, data.website]
          .filter(Boolean)
          .join(' | ')}
      </div>
    </div>

    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase italic">
        Professional Summary
      </h2>
      <p className="text-sm">{data.summary}</p>
    </section>

    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase italic">
        Experience
      </h2>
      {(data.experience ?? []).map((exp, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between font-bold text-sm">
            <span>
              {exp.company} &ndash; {exp.title ?? exp.role}
            </span>
            <span>
              {exp.startDate} &ndash; {exp.endDate}
            </span>
          </div>
          {exp.location && <div className="text-xs italic mb-1">{exp.location}</div>}
          <p className="text-sm whitespace-pre-line">{exp.description}</p>
        </div>
      ))}
    </section>

    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase italic">
        Education
      </h2>
      {(data.education ?? []).map((edu, i) => (
        <div key={i} className="mb-2 flex justify-between text-sm">
          <span>
            <strong>{edu.school}</strong>
            {edu.degree ? `, ${edu.degree}` : ''}
            {edu.field ? ` in ${edu.field}` : ''}
          </span>
          <span>{edu.endDate}</span>
        </div>
      ))}
    </section>

    <section>
      <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase italic">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {(data.skills ?? []).map((skill, i) => (
          <span key={i} className="text-xs bg-gray-100 px-2 py-1 border border-gray-300">
            {skill.name} ({skill.category})
          </span>
        ))}
      </div>
    </section>
  </div>
);
