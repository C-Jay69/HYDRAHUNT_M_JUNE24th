'use client';

import React, { useState, useEffect } from 'react';
import {
  Target, Radar, Handshake, Search,
  Plus, Filter, Download, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useResumes } from '@/hooks/useResumes';

export default function Dashboard() {
  const { resumes, loading: isLoading } = useResumes();
  const [isHunting, setIsHunting] = useState(false);

  const handleNewHunt = async () => {
    setIsHunting(true);
    // In a real app, this would open a modal to configure the hunt
    setTimeout(() => setIsHunting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12 font-display">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">The Kill List</h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Targeting active opportunities across global sectors.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-card-dark border-border-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10">
              Refine Weapons
            </Button>
            <Button
              onClick={handleNewHunt}
              disabled={isHunting}
              className="bg-gradient-to-r from-[#b154f8] to-[#06b6d4] text-white text-xs font-bold uppercase tracking-widest active-glow hover:brightness-110 transition-all"
            >
              {isHunting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
              {isHunting ? 'Initiating Hunt...' : 'New Hunt'}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Radar className="text-gray-500" />}
            label="Active Hunts"
            value="12"
            trend="+20%"
          />
          <StatCard
            icon={<Target className="text-gray-500" />}
            label="Targets Struck"
            value="148"
            trend="+5%"
          />
          <StatCard
            icon={<Handshake className="text-gray-500" />}
            label="Interviews Secured"
            value="07"
            trend="+2%"
          />
        </section>

        {/* The Kill List Table */}
        <section className="rounded-xl border border-white/10 bg-card-dark/30 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Target</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Objective</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Strike Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-500 animate-pulse">
                      SCANNING TARGET DATABASE...
                    </td>
                  </tr>
                ) : (
                  // Mock data for visual fidelity based on design
                  [
                    { company: 'Stark Industries', role: 'Lead AI Integration Engineer', date: '2023.10.24', status: 'STRIKING', color: 'text-[#b154f8]', bg: 'bg-[#b154f8]/20', border: 'border-[#b154f8]/30' },
                    { company: 'Wayne Ent.', role: 'Product Designer (R&D)', date: '2023.10.22', status: 'CONFIRMED', color: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/20', border: 'border-[#06b6d4]/30' },
                    { company: 'Cyberdyne Systems', role: 'Backend Lead Architect', date: '2023.10.20', status: 'TERMINATED', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                    { company: 'Umbrella Corp', role: 'Forward Deployed Engineer', date: '2023.10.18', status: 'STRIKING', color: 'text-[#b154f8]', bg: 'bg-[#b154f8]/20', border: 'border-[#b154f8]/30' },
                  ].map((target, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/10 rounded-lg w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-500">
                            {target.company[0]}
                          </div>
                          <span className="text-sm font-bold text-white uppercase">{target.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-300">{target.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-500">{target.date}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${target.bg} ${target.color} border ${target.border} uppercase`}>
                          {target.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-card-dark border border-white/10 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-white text-3xl font-bold">{value}</p>
        <p className="text-[#10b981] text-xs font-bold">{trend}</p>
      </div>
    </div>
  );
}
