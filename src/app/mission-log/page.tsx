'use client';

import React, { useState, useEffect } from 'react';
import { Bolt, Target, Search, Filter, Download, AlertCircle, CheckCircle2, Clock, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Mission {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'STRIKING' | 'INTERVIEWING' | 'OFFER';
  matchScore?: number;
  appliedAt: string;
  notes?: string;
  jobUrl?: string;
}

type StatusKey = 'CONFIRMED' | 'PENDING' | 'FAILED' | 'STRIKING';

const STATUS_COLORS: Record<StatusKey, { color: string; bg: string; border: string }> = {
  CONFIRMED: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/40' },
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/40' },
  FAILED: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/40' },
  STRIKING: { color: 'text-[#0df2f2]', bg: 'bg-[#0df2f2]/10', border: 'border-[#0df2f2]/30' },
};

export default function MissionLog() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMission, setExpandedMission] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const response = await fetch('/api/strike/missions');
        const data = await response.json();
        if (data.success) {
          setMissions(data.missions);
        }
      } catch (error) {
        console.error('Failed to fetch missions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-10 py-8 max-w-[1400px] mx-auto w-full">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black leading-tight tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#0df2f2] to-[#3b82f6]">
              Strike Log: Mission History
            </h1>
            <p className="text-gray-400 text-lg font-normal leading-normal max-w-2xl">
              End-to-end tactical analysis of every automated and manual infiltration attempt across the global talent infrastructure.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <div className="flex flex-col items-center border-r border-gray-800 pr-4">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Active Strikes</span>
              <span className="text-2xl font-bold text-[#0df2f2]">{missions.length}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Infiltration Rate</span>
              <span className="text-2xl font-bold text-emerald-400">64%</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 bg-gray-900/30 p-3 rounded-xl border border-gray-800/50">
          <Filter className="text-gray-500 ml-2 size-5" />
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="h-10 rounded-lg bg-gray-900 border-gray-700 px-4 hover:border-[#0df2f2] transition-all text-gray-300 text-sm font-medium"
            >
              Success Prob: 80%+ <ChevronRight className="ml-2 size-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-lg bg-gray-900 border-gray-700 px-4 hover:border-[#0df2f2] transition-all text-gray-300 text-sm font-medium"
            >
              Aggression: Overkill <ChevronRight className="ml-2 size-4 rotate-90" />
            </Button>
          </div>
          <div className="h-6 w-px bg-gray-800 mx-2" />
          <button className="text-[#0df2f2] text-xs font-bold uppercase tracking-widest hover:underline">
            Clear Tactical Filters
          </button>
        </div>

        {/* Mission Table */}
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/20 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-6 py-4 text-gray-400 uppercase text-xs font-bold tracking-widest w-[28%]">Target Profile</th>
                <th className="px-6 py-4 text-gray-400 uppercase text-xs font-bold tracking-widest w-[12%]">Strike Type</th>
                <th className="px-6 py-4 text-gray-400 uppercase text-xs font-bold tracking-widest w-[15%]">Weapon System</th>
                <th className="px-6 py-4 text-gray-400 uppercase text-xs font-bold tracking-widest w-[15%]">Payload</th>
                <th className="px-6 py-4 text-gray-400 uppercase text-xs font-bold tracking-widest w-[15%]">Status</th>
                <th className="px-6 py-4 text-gray-400 uppercase text-xs font-bold tracking-widest w-[15%] text-right">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500 animate-pulse">
                    SYNCING STRIKE LOGS...
                  </td>
                </tr>
              ) : missions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                    No missions recorded. Initiate a hunt to populate the log.
                  </td>
                </tr>
              ) : (
                missions.map((mission: Mission, i: number) => {
                  const statusKey = (mission.status as StatusKey) in STATUS_COLORS
                    ? (mission.status as StatusKey)
                    : 'PENDING';
                  const currentStatus = STATUS_COLORS[statusKey];

                  return (
                    <React.Fragment key={mission.id || i}>
                      <tr
                        className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors cursor-pointer group"
                        onClick={() => setExpandedMission(expandedMission === i ? null : i)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-white rounded overflow-hidden flex items-center justify-center shrink-0">
                              <div className="text-black font-bold">{mission.company?.[0] || 'T'}</div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-base group-hover:text-[#0df2f2]">
                                {mission.company}
                              </span>
                              <span className="text-gray-500 text-sm">{mission.jobTitle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[#0df2f2]">
                            <Bolt className="size-5" />
                            <span className="text-sm font-bold uppercase tracking-tighter">Auto-Strike</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <FileText className="text-gray-500 size-5" />
                            <span className="text-sm text-gray-300">Weaponized Asset</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold uppercase rounded-full border border-gray-600">
                            Payload_V1
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div
                            className={cn(
                              'inline-flex items-center gap-2 px-3 py-1 rounded uppercase text-xs font-black tracking-widest border',
                              currentStatus.bg,
                              currentStatus.color,
                              currentStatus.border
                            )}
                          >
                            <span className="size-2 rounded-full bg-current animate-pulse" />
                            {mission.status}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-[#0df2f2]" style={{ width: `${mission.matchScore ?? 75}%` }} />
                            </div>
                            <span className="text-xs font-bold text-white tracking-widest uppercase">
                              {mission.matchScore ?? 75}% Match
                            </span>
                          </div>
                        </td>
                      </tr>
                      {expandedMission === i && (
                        <tr className="bg-gray-900/40 border-b border-gray-800">
                          <td colSpan={6} className="px-6 py-0">
                            <div className="py-6 flex gap-8 border-l-4 border-[#0df2f2] ml-2 pl-8">
                              <div className="flex-1">
                                <h3 className="text-[#0df2f2] font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Search className="size-5" /> Post-Strike Analysis
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed border-l border-gray-800 pl-4">
                                  {mission.notes || 'No detailed analysis available for this strike.'}
                                </p>
                              </div>
                              <div className="w-1/3 bg-black/50 p-4 rounded-lg border border-gray-800">
                                <h3 className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
                                  Next Tactical Move
                                </h3>
                                <ul className="space-y-2">
                                  <li className="flex gap-2 items-start text-xs text-gray-400">
                                    <CheckCircle2 className="text-emerald-400 size-4 mt-0.5" />
                                    <span>Prepare &quot;Interview Protocol A&quot; for possible escalation.</span>
                                  </li>
                                  <li className="flex gap-2 items-start text-xs text-gray-400">
                                    <Clock className="text-[#0df2f2] size-4 mt-0.5" />
                                    <span>Manual follow-up triggered if no response by T-minus 48h.</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
