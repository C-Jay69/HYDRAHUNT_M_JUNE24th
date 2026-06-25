import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Send, UserCheck, Trophy, Clock, AlertCircle } from 'lucide-react';

interface JobTarget {
  id: string;
  title: string;
  company: string;
  location: string;
  jobUrl: string;
  matchScore: number;
  status: 'NEW' | 'APPLIED' | 'SKIPPED';
}

interface HuntDashboardProps {
  targets: JobTarget[];
  onApply: (targetId: string) => void;
  onHunt: () => void;
  isHunting: boolean;
}

export const HuntDashboard: React.FC<HuntDashboardProps> = ({ targets, onApply, onHunt, isHunting }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-red-500" />
            Target Acquisition
          </h2>
          <p className="text-slate-500">AI-discovered job targets matching your lethality profile.</p>
        </div>
        <Button
          onClick={onHunt}
          disabled={isHunting}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
        >
          {isHunting ? 'Hunting...' : 'Start New Hunt'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map((target) => (
          <Card key={target.id} className="group hover:ring-2 ring-red-500 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-xs font-mono">
                  Score: {target.matchScore}%
                </Badge>
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                  {target.status}
                </div>
              </div>
              <CardTitle className="text-lg font-bold mt-2">{target.title}</CardTitle>
              <div className="text-sm text-slate-500">{target.company} • {target.location}</div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-between items-center">
              <a
                href={target.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                View Job
              </a>
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1"
                onClick={() => onApply(target.id)}
                disabled={target.status === 'APPLIED'}
              >
                <Send className="w-3 h-3" />
                {target.status === 'APPLIED' ? 'Applied' : 'Auto-Apply'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {targets.length === 0 && !isHunting && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No targets acquired. Launch a hunt to find high-fit roles.</p>
        </div>
      )}
    </div>
  );
};
