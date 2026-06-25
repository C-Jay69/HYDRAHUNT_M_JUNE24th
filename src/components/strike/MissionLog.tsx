import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, UserCheck, AlertCircle, MoreHorizontal } from 'lucide-react';

interface JobStrike {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'PENDING' | 'CONFIRMED' | 'INTERVIEWING' | 'OFFER';
  matchScore?: number;
  appliedAt: string;
  notes?: string;
}

interface MissionLogProps {
  strikes: JobStrike[];
  onUpdateStatus: (id: string, newStatus: JobStrike['status']) => void;
}

const COLUMNS: { id: JobStrike['status']; label: string; icon: any; color: string }[] = [
  { id: 'PENDING', label: 'Queued/Pending', icon: Clock, color: 'bg-slate-100 text-slate-600' },
  { id: 'CONFIRMED', label: 'Applied', icon: UserCheck, color: 'bg-blue-100 text-blue-600' },
  { id: 'INTERVIEWING', label: 'Interviewing', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'OFFER', label: 'Offer Received', icon: Trophy, color: 'bg-green-100 text-green-600' },
];

export const MissionLog: React.FC<MissionLogProps> = ({ strikes, onUpdateStatus }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-full">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-80 flex flex-col h-full">
          {/* Column header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${col.color}`}>
                <col.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-700">{col.label}</h3>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {strikes.filter((s) => s.status === col.id).length}
            </Badge>
          </div>

          {/* Cards list */}
          <div className="space-y-3 overflow-y-auto pr-2">
            {strikes
              .filter((s) => s.status === col.id)
              .map((strike) => (
                <Card
                  key={strike.id}
                  className="group hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-slate-400 uppercase">
                        {strike.company}
                      </div>
                      {strike.matchScore && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-blue-50 text-blue-600"
                        >
                          {strike.matchScore}% Fit
                        </Badge>
                      )}
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                      {strike.jobTitle}
                    </div>
                    <div className="text-xs text-slate-500 mb-3">{strike.location}</div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 italic">
                        {new Date(strike.appliedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        {COLUMNS.filter((c) => c.id !== strike.status).map((c) => (
                          <Button
                            key={c.id}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-blue-600"
                            onClick={() => onUpdateStatus(strike.id, c.id)}
                            title={`Move to ${c.label}`}
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
