import React from 'react';
import { Resume } from '@/types/hydranhunt';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, FileText, History, MoreVertical, Download, Copy, Trash2 } from 'lucide-react';

interface VaultDashboardProps {
  resumes: Resume[];
  onOpenBuilder: (resumeId: string) => void;
  onCreateFolder: (name: string) => void;
}

export const VaultDashboard: React.FC<VaultDashboardProps> = ({ resumes, onOpenBuilder, onCreateFolder }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Vault</h1>
          <p className="text-slate-500">Manage your weaponized resumes and version history.</p>
        </div>
        <Button onClick={() => onCreateFolder('New Folder')}>+ New Folder</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="group relative overflow-hidden hover:ring-2 ring-blue-500 transition-all duration-200">
            <div className="aspect-[3/4] bg-slate-100 flex items-center justify-center relative">
              <FileText className="w-12 h-12 text-slate-300" />
              <div className="absolute top-2 right-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {(resume.versions ?? []).length} Versions
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 truncate">{resume.title}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Folder className="w-3 h-3" />
                <span>{resume.folderName || 'General'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onOpenBuilder(resume.id)}
                >
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3 h-3 mr-1" /> PDF
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
