import React from 'react';
import { ResumeVersion, TemplateId } from '@/types/hydranhunt';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { TechnicalTemplate } from './templates/TechnicalTemplate';

interface ResumePreviewProps {
  data: ResumeVersion;
  templateId: TemplateId;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, templateId }) => {
  switch (templateId) {
    case TemplateId.CLASSIC:
      return <ClassicTemplate data={data} className="shadow-2xl scale-95 origin-top" />;
    case TemplateId.MODERN:
      return <ModernTemplate data={data} className="shadow-2xl scale-95 origin-top" />;
    case TemplateId.TECHNICAL:
      return <TechnicalTemplate data={data} className="shadow-2xl scale-95 origin-top" />;
    default:
      return <ClassicTemplate data={data} className="shadow-2xl scale-95 origin-top" />;
  }
};
