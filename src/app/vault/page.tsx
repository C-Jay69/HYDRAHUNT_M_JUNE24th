'use client';

import React, { useState } from 'react';
import { Search, Cpu, Download, Wand2, Target, History, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResumes } from '@/hooks/useResumes';
import { cn } from '@/lib/utils';

export default function VersionVault() {
  const { resumes, loading: isLoading } = useResumes();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-black text-white font-display selection:bg-[#0df2f2]/30">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-3 bg-black sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-8 text-[#0df2f2]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                  <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tighter">HYDRAHUNT</h2>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/forge" className="text-gray-400 hover:text-[#0df2f2] text-sm font-medium uppercase tracking-widest transition-colors">Armory</a>
              <a href="/mission-log" className="text-gray-400 hover:text-[#0df2f2] text-sm font-medium uppercase tracking-widest transition-colors">Strikes</a>
              <a href="/vault" className="text-[#0df2f2] text-sm font-medium uppercase tracking-widest border-b border-[#0df2f2]">Vault</a>
              <a href="/analytics" className="text-gray-400 hover:text-[#0df2f2] text-sm font-medium uppercase tracking-widest transition-colors">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full border border-[#0df2f2]/30 bg-gray-800" />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 px-8 py-10">
        <div className="col-span-9 flex flex-col gap-8">
          {/* Page Heading & Search */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#0df2f2] tracking-tight uppercase">Version Vault</h1>
                <p className="text-gray-500 mt-2 font-medium tracking-wide uppercase text-xs">Secure Repository for Strategic Assets</p>
              </div>
              <Button className="bg-[#0df2f2] hover:bg-[#0df2f2]/80 text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all uppercase text-sm tracking-tighter">
                <Cpu className="size-4" /> Forge New Weapon
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0df2f2]/50 size-5" />
              <Input
                className="w-full bg-white/5 border-white/10 rounded-xl py-6 pl-12 pr-4 text-lg focus:ring-1 focus:ring-[#0df2f2] focus:border-[#0df2f2] outline-none transition-all placeholder:text-white/20"
                placeholder="Search your weapons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-white/5">
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-[#0df2f2]/10 text-[#0df2f2] border-[#0df2f2]/20 px-4 py-2 rounded-lg text-sm font-semibold">
                TYPE: TECH <ChevronRight className="ml-2 size-4 rotate-90" />
              </Button>
              <Button variant="outline" className="bg-white/5 text-gray-400 border-white/10 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                TYPE: MGMT <ChevronRight className="ml-2 size-4 rotate-90" />
              </Button>
            </div>
            <div className="bg-white/5 p-1 rounded-lg flex">
              <button className="px-4 py-1 rounded text-xs font-bold uppercase cursor-pointer bg-black text-[#0df2f2] shadow-sm">Scouted</button>
              <button className="px-4 py-1 rounded text-xs font-bold uppercase cursor-pointer text-gray-500 hover:text-gray-300">Struck</button>
              <button className="px-4 py-1 rounded text-xs font-bold uppercase cursor-pointer text-gray-500 hover:text-gray-300">Draft</button>
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-gray-500 animate-pulse">SYNCING VAULT ASSETS...</div>
            ) : (
              [
                { name: 'SYSTEMS_ARCH_V4.PDF', lethality: '94%', industry: 'CLOUDNATIVE / SAAS', date: 'OCT 24, 2023', status: 'Scouted', glow: true },
                { name: 'CTO_GLOBAL_EXEC.PDF', lethality: '81%', industry: 'FINTECH / ADVISORY', date: 'SEP 12, 2023', status: 'Struck', glow: false },
                { name: 'CREATIVE_STRAT_01.PDF', lethality: '42%', industry: 'MEDIA / DESIGN', date: 'OCT 30, 2023', status: 'Draft', glow: false },
              ].map((doc, i) => (
                <div key={i} className={cn(
                  "relative group bg-card-dark rounded-xl border border-white/10 overflow-hidden transition-transform hover:-translate-y-1",
                  doc.glow && "shadow-[0_0_15px_rgba(13,242,242,0.2)]"
                )}>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="relative h-48 bg-black rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
                      <FileText className="size-20 text-white/20" />
                      <div className={cn(
                        "absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest z-20 border",
                        doc.status === 'Scouted' ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                        doc.status === 'Struck' ? "bg-green-500/20 text-green-500 border-green-500/30" :
                        "bg-gray-500/20 text-gray-500 border-gray-500/30"
                      )}>
                        {doc.status}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg leading-tight truncate">{doc.name}</h3>
                        <div className="text-right">
                          <span className={cn("text-2xl font-black", doc.lethality === '42%' ? 'text-red-500' : 'text-[#0df2f2]')}>{doc.lethality}</span>
                          <p className="text-[9px] text-gray-500 font-bold uppercase -mt-1">Lethality</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Target Industry</p>
                          <p className="text-xs font-medium text-white/80 tracking-wide truncate">{doc.industry}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Date Forged</p>
                          <p className="text-xs font-medium text-white/80 tracking-wide">{doc.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center gap-3 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="w-full bg-[#8b5cf6] text-white py-2 rounded font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#8b5cf6]/80">
                      <Wand2 className="size-4" /> Re-Forge Asset
                    </Button>
                    <Button className="w-full bg-[#0df2f2] text-black py-2 rounded font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#0df2f2]/80">
                      <Target className="size-4" /> Initiate Strike
                    </Button>
                    <Button variant="outline" className="w-full bg-white/10 text-white py-2 rounded font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-white/20">
                      <Download className="size-4" /> Download Intel
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Audit Log */}
        <aside className="col-span-3 flex flex-col gap-6">
          <div className="bg-card-dark border border-white/10 rounded-xl flex flex-col h-[calc(100vh-160px)] sticky top-24 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h4 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                <History className="text-[#0df2f2] size-5" /> Audit Log
              </h4>
              <span className="text-[10px] font-mono text-[#0df2f2]/50">REAL-TIME</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              {[
                { type: 'SYSTEM UPDATE', color: 'text-[#0df2f2]', bg: 'bg-[#0df2f2]/10', msg: 'Optimized Keywords for Google Strike in SYSTEMS_ARCH_V4', time: '14:22:05', trend: '+5.2% LETHALITY' },
                { type: 'FORGE ENGINE', color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10', msg: 'Hardened Metrics in Experience Section for CTO_GLOBAL_EXEC', time: '12:10:48' },
                { type: 'STRYKE ALERT', color: 'text-red-500', bg: 'bg-red-500/10', msg: 'Weapon Asset MARKETING_PRO retired to cold storage.', time: '09:15:22' },
              ].map((log, i) => (
                <div key={i} className="flex flex-col gap-2 border-t border-white/5 pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", log.color, log.bg)}>{log.type}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed italic">"{log.msg}"</p>
                  {log.trend && (
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[95%]"></div>
                    </div>
                  )}
                  {log.trend && <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">{log.trend}</p>}
                </div>
              ))}
            </div>
            <div className="p-4 bg-black border-t border-white/10 text-center">
              <button className="text-[10px] text-gray-500 hover:text-[#0df2f2] font-bold uppercase tracking-[0.2em] transition-colors">Export Vault Manifest</button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}


