'use client';

import React, { useState, useEffect } from 'react';
import {
  Bolt, Download, History, Plus,
  Rocket, Shield, Code,
  ChevronRight, Info, Save, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useResumes } from '@/hooks/useResumes';
import { ResumeData } from '@/types/hydranhunt';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ResumeForge() {
  const { resumes, loading: isLoading } = useResumes();
  const [rawIntel, setRawIntel] = useState('');
  const [aggression, setAggression] = useState([85]);
  const [precision, setPrecision] = useState([92]);
  const [atsDensity, setAtsDensity] = useState([70]);
  const [targetingMode, setTargetingMode] = useState('disruptive');
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [isForging, setIsForging] = useState(false);

  const handleForge = async () => {
    setIsForging(true);
    // This will eventually call the API to forge a new resume version
    setTimeout(() => setIsForging(false), 2000);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-display">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black px-6 py-3 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[#b154f8]">
            <Shield className="size-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">HYDRAHUNT</h1>
          <div className="h-2 w-2 rounded-full bg-[#b154f8] animate-pulse ml-2 shadow-[0_0_8px_#b154f8]"></div>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase">Dashboard</Link>
            <Link href="/forge" className="text-sm font-medium text-white border-b-2 border-[#b154f8] uppercase">Weaponry</Link>
            <Link href="/mission-log" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase">Jobs</Link>
            <Link href="/vault" className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase">Vault</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 border-gray-700 hover:border-white text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">
              <Download className="size-3" /> Export PDF
            </Button>
            <div className="size-8 rounded-full border border-[#b154f8]/50 p-0.5">
              <div className="size-full rounded-full bg-gray-800 bg-cover bg-center" />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gray-900/50 px-6 py-2 border-b border-gray-800 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 shrink-0">
        <Link href="/forge" className="hover:text-[#b154f8] transition-colors">Weaponry</Link>
        <ChevronRight className="size-3" />
        <span className="text-white">Resume Forge</span>
      </div>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: AI Strike Controls */}
        <aside className="w-64 border-r border-gray-800 bg-black p-6 flex flex-col gap-8 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-xs font-black text-[#b154f8] mb-6 uppercase tracking-widest">AI Strike Controls</h3>
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>Aggression</span>
                  <span className="text-[#b154f8]">{aggression[0]}%</span>
                </div>
                <Slider
                  value={aggression}
                  onValueChange={setAggression}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>Precision</span>
                  <span className="text-[#b154f8]">{precision[0]}%</span>
                </div>
                <Slider
                  value={precision}
                  onValueChange={setPrecision}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>ATS Density</span>
                  <span className="text-[#b154f8]">{atsDensity[0]}%</span>
                </div>
                <Slider
                  value={atsDensity}
                  onValueChange={setAtsDensity}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-black text-gray-500 mb-4 uppercase tracking-widest">Targeting Mode</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'disruptive', icon: Rocket, label: 'Disruptive' },
                { id: 'executive', icon: Shield, label: 'Executive' },
                { id: 'technical', icon: Code, label: 'Hard Technical' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTargetingMode(mode.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all border text-left",
                    targetingMode === mode.id
                      ? "bg-[#b154f8]/10 border-[#b154f8]/30 text-[#b154f8]"
                      : "bg-transparent border-transparent text-gray-400 hover:bg-gray-800"
                  )}
                >
                  <mode.icon className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-gray-800">
            <div className="flex items-center gap-3 text-gray-500">
              <Info className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cortex-V4 Active</span>
            </div>
          </div>
        </aside>

        {/* Middle Panel: Feed the Hydra */}
        <section className="flex-1 flex flex-col border-r border-gray-800 bg-black">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/20">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Feed the Hydra</h2>
            <span className="text-[10px] text-gray-500 font-mono tracking-tighter">RAW_INTEL_BUFFER_v2.0</span>
          </div>
          <div className="flex-1 relative p-6">
            <div className="absolute left-6 top-6 bottom-6 w-8 flex flex-col items-center text-gray-700 font-mono text-xs select-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i}>{String(i + 1).padStart(2, '0')}</span>
              ))}
            </div>
            <textarea
              value={rawIntel}
              onChange={(e) => setRawIntel(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-gray-300 font-mono text-sm leading-relaxed pl-10 resize-none placeholder:text-gray-800"
              placeholder="Paste Raw Intel here: notes, old resumes, or bullet dumps... &#10;&#10;&gt; SYSTEM_WAITING_FOR_INPUT..."
            />
          </div>
          <div className="p-6 bg-gray-900/40">
            <Button
              onClick={handleForge}
              disabled={isForging || !rawIntel}
              className="w-full bg-gradient-to-r from-[#b154f8] to-[#22d3ee] h-12 rounded-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(177,84,248,0.3)] font-black uppercase tracking-[0.2em] text-sm text-white border-0"
            >
              {isForging ? (
                <RefreshCw className="animate-spin size-5" />
              ) : (
                <Bolt className="size-5" />
              )}
              {isForging ? 'Forging Weapon...' : 'Forge Resume'}
            </Button>
          </div>
        </section>

        {/* Right Panel: Weaponized Document Preview */}
        <section className="flex-[1.2] flex flex-col bg-gray-900 overflow-y-auto">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Weaponized Preview</h2>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[10px] text-green-500 font-bold uppercase">Optimized</span>
            </div>
          </div>
          <div className="p-12 flex justify-center">
            <div className="w-full max-w-[650px] bg-white text-gray-900 p-12 shadow-2xl rounded-sm min-h-[842px] relative overflow-hidden font-sans">
              {/* Mock Resume Content based on design */}
              <header className="mb-10 border-b-4 border-gray-900 pb-6">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Alex Sterling</h1>
                <p className="text-sm font-bold text-[#b154f8] tracking-[0.2em] mb-4">PRINCIPAL ARCHITECT / DISTRIBUTED SYSTEMS</p>
                <div className="flex gap-4 text-[10px] font-bold text-gray-500">
                  <span>SAN FRANCISCO, CA</span>
                  <span>STERLING.DEV</span>
                  <span>LINKEDIN.COM/IN/ASTERLING</span>
                </div>
              </header>
              <section className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-1 mb-4">Summary</h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  High-performance systems architect with 10+ years of experience in <span className="bg-[#b154f8]/10 border-b-2 border-dashed border-[#b154f8] cursor-help group relative">building large-scale cloud infrastructure
                    <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-[10px] rounded-lg w-48 z-20 shadow-xl">
                      Optimized for ATS keyword: Distributed Systems Architecture. Higher strike rate for Tier-1 Tech.
                    </span>
                  </span>. Expert in Rust, Go, and Kubernetes, focused on zero-downtime deployments.
                </p>
              </section>
              <section className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-1 mb-4">Experience</h2>
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-md font-bold">TechCore Systems</h3>
                    <span className="text-[10px] font-bold text-gray-400">2019 — PRESENT</span>
                  </div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Senior Infrastructure Engineer</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                    <li>Architected a custom mesh network that <span className="bg-[#b154f8]/10 border-b-2 border-dashed border-[#b154f8] cursor-help group relative">reduced latency by 45%
                      <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-[10px] rounded-lg w-48 z-20 shadow-xl">
                        Quantified impact detected. Adjusted phrasing to emphasize technical precision.
                      </span>
                    </span> across 4 global regions.</li>
                    <li>Led the migration from monolithic architecture to <span className="bg-[#b154f8]/10 border-b-2 border-dashed border-[#b154f8] cursor-help group relative">event-driven microservices
                      <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-[10px] rounded-lg w-48 z-20 shadow-xl">
                        Weaponized keyword: Microservices. Aligned with target Job Description: #J-9012.
                      </span>
                    </span>.</li>
                  </ul>
                </div>
              </section>
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-1 mb-4">Technical Armory</h2>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-gray-400 uppercase tracking-tighter block mb-1">Languages</span>
                    <p className="text-gray-900 font-bold">Rust, Go, Python, C++, TypeScript</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 uppercase tracking-tighter block mb-1">Infrastructure</span>
                    <p className="text-gray-900 font-bold">AWS, Kubernetes, Terraform, Docker</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Right Strip: Version Vault Quick-Access */}
        <aside className="w-20 border-l border-gray-800 bg-black flex flex-col items-center py-6 gap-6 overflow-y-auto shrink-0">
          <History className="text-gray-500 size-5" />
          <div className="flex flex-col gap-6">
            {[
              { score: '98%', time: '12:45 PM', active: true },
              { score: '82%', time: '11:20 AM', active: false },
              { score: '75%', time: 'YESTERDAY', active: false },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className={cn(
                  "size-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all",
                  v.active ? "border-[#b154f8] text-[#b154f8] group-hover:bg-[#b154f8] group-hover:text-white" : "border-gray-700 text-gray-500 group-hover:border-[#b154f8]"
                )}>
                  {v.score}
                </div>
                <span className="text-[8px] text-gray-500 font-bold">{v.time}</span>
              </div>
            ))}
            <div className="w-px h-12 bg-gray-800"></div>
            <button className="size-10 rounded-full border border-dashed border-gray-700 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all">
              <Plus className="size-5" />
            </button>
          </div>
        </aside>
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-black border-t border-gray-800 px-6 py-1.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-[#b154f8] shadow-[0_0_5px_#b154f8]"></div>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Hydra Core Sync: 100%</span>
          </div>
          <div className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Lat: 12ms</div>
        </div>
        <div className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">
          Logged in as STERLING_ARCHITECT_01
        </div>
      </footer>
    </div>
  );
}


