'use client';

import React, { useEffect, useState } from 'react';
import {
  Compass, Target, Loader2, AlertTriangle, ArrowRight,
  GraduationCap, Award, Map as MapIcon, CheckCircle2, ExternalLink, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useResumes } from '@/hooks/useResumes';
import { useAnalysis } from '@/hooks/useAnalysis';
import { cn } from '@/lib/utils';

interface SkillGap {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  howToAcquire: string;
}

interface Course {
  name: string;
  platform: string;
  cost?: string;
  isFree?: boolean;
  duration: string;
  url: string;
  relevanceTag?: string;
}

interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  actions: string[];
}

interface TransitionResult {
  feasibilityScore: number;
  transitionDifficulty: string;
  timeEstimate: string;
  transferableSkills: string[];
  skillGaps: SkillGap[];
  recommendedCourses: Course[];
  certifications: string[];
  roadmap: RoadmapPhase[];
  adviceText: string;
}

const importanceColor: Record<string, string> = {
  critical: 'text-red-400 border-red-500/30 bg-red-500/10',
  important: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  'nice-to-have': 'text-gray-400 border-gray-500/30 bg-gray-500/10',
};

function scoreColor(score: number) {
  if (score >= 70) return 'text-[#06b6d4]';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

export default function CareerTerritoryMap() {
  const { resumes, fetchResumes, updateResume, createResume } = useResumes();
  const { analyzeCareerTransition, analyzing, error } = useAnalysis();

  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [targetCareer, setTargetCareer] = useState('');
  const [result, setResult] = useState<TransitionResult | null>(null);
  const [reframing, setReframing] = useState(false);
  const [reframeSaved, setReframeSaved] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const selectedResume = resumes.find((r: any) => r.id === selectedResumeId);

  const sortedCourses = result?.recommendedCourses
    ? [...result.recommendedCourses].sort((a, b) => Number(!!b.isFree) - Number(!!a.isFree))
    : [];

  const handleAnalyze = async () => {
    if (!selectedResumeId || !targetCareer.trim()) return;
    setReframeSaved(false);
    try {
      const res = await analyzeCareerTransition(null, selectedResumeId, targetCareer.trim());
      setResult(res.result);
    } catch {
      // error state surfaced via useAnalysis().error
    }
  };

  const handleReframe = async () => {
    if (!selectedResumeId || !targetCareer.trim()) return;
    setReframing(true);
    setReframeSaved(false);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          targetJob: targetCareer.trim(),
          analysisType: 'optimize',
          improvements: (result?.skillGaps || []).map((g) => ({
            section: 'Experience',
            suggestion: `Reframe experience to emphasize ${g.skill} (${g.howToAcquire})`,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reframe failed');

      const optimized = data.result;
      await createResume({
        userId: (selectedResume as any)?.userId,
        title: `${(selectedResume as any)?.title || 'Resume'} — ${targetCareer.trim()} Pivot`,
        fullName: (selectedResume as any)?.currentVersion?.fullName,
        email: (selectedResume as any)?.currentVersion?.email,
        phone: (selectedResume as any)?.currentVersion?.phone,
        location: (selectedResume as any)?.currentVersion?.location,
        summary: optimized.summary,
        experience: (optimized.experience || []).map((exp: any) => ({
          title: exp.title,
          company: exp.company,
          startDate: exp.period,
          endDate: '',
          description: exp.description,
        })),
        education: (selectedResume as any)?.currentVersion?.educations || [],
        skills: (optimized.skills || []).flatMap((group: any) =>
          (group.items || []).map((name: string) => ({ name, category: group.category }))
        ),
      } as any);

      setReframeSaved(true);
    } catch (err) {
      console.error('Reframe failed:', err);
    } finally {
      setReframing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-display">
      <header className="border-b border-white/10 px-8 py-3 bg-black sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Compass className="text-[#b154f8]" size={22} /> CAREER TERRITORY MAP
          </h2>
          <nav className="flex items-center gap-6 text-sm font-medium uppercase tracking-widest text-gray-400">
            <a href="/dashboard" className="hover:text-[#06b6d4] transition-colors">Hunt Mode</a>
            <a href="/forge" className="hover:text-[#06b6d4] transition-colors">Weaponry</a>
            <a href="/vault" className="hover:text-[#06b6d4] transition-colors">Vault</a>
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
            Plot Your <span className="text-[#b154f8]">Career Pivot</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select a resume in your vault and the field you want to break into. Hydra maps the
            transferable skills, the gaps standing in your way, and the fastest route across.
          </p>
        </div>

        <div className="bg-[#0a0a0a] border-2 border-[#222] rounded-2xl p-6 md:p-8 mb-12">
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Current Resume</label>
              <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                <SelectTrigger className="bg-[#111] border-[#333] text-white w-full">
                  <SelectValue placeholder="Choose a resume from your vault" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Target Field</label>
              <Input
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                placeholder="e.g. Cybersecurity Analyst"
                className="bg-[#111] border-[#333] text-white"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !selectedResumeId || !targetCareer.trim()}
              className="bg-[#b154f8] hover:bg-[#b154f8]/90 text-white font-bold px-6"
            >
              {analyzing ? <Loader2 className="animate-spin mr-2" size={18} /> : <Target className="mr-2" size={18} />}
              Map Route
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-3 mt-6 bg-red-950/40 border border-red-500/30 rounded-lg p-4 text-red-300">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {result && (
          <div className="flex flex-col gap-12">
            {/* Feasibility Overview */}
            <section className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className={cn('text-6xl font-black', scoreColor(result.feasibilityScore))}>
                  {result.feasibilityScore}
                </div>
                <div className="text-gray-500 uppercase text-xs tracking-widest mt-1">Feasibility Score</div>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold text-[#06b6d4] capitalize">{result.transitionDifficulty}</div>
                <div className="text-gray-500 uppercase text-xs tracking-widest mt-1">Transition Difficulty</div>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold text-white">{result.timeEstimate}</div>
                <div className="text-gray-500 uppercase text-xs tracking-widest mt-1">Estimated Time</div>
              </div>
            </section>

            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{result.adviceText}</p>

            {/* Gap Analysis */}
            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-[#06b6d4] uppercase mb-4">
                  <CheckCircle2 size={20} /> Transferable Skills
                </h3>
                <ul className="flex flex-col gap-2">
                  {result.transferableSkills?.map((s, i) => (
                    <li key={i} className="bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-gray-200">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-bold text-[#b154f8] uppercase mb-4">
                  <AlertTriangle size={20} /> Skill Gaps
                </h3>
                <ul className="flex flex-col gap-2">
                  {result.skillGaps?.map((g, i) => (
                    <li
                      key={i}
                      className={cn('border rounded-lg px-4 py-3', importanceColor[g.importance] || importanceColor['nice-to-have'])}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{g.skill}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-70">{g.importance}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{g.howToAcquire}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Roadmap */}
            <section>
              <h3 className="flex items-center gap-2 font-bold text-white uppercase mb-6">
                <MapIcon size={20} className="text-[#06b6d4]" /> Transition Roadmap
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {result.roadmap?.sort((a, b) => a.phase - b.phase).map((phase) => (
                  <div key={phase.phase} className="relative bg-[#0a0a0a] border-2 border-[#222] rounded-2xl p-6">
                    <div className="text-5xl font-black text-[#222] absolute top-4 right-4">{phase.phase}</div>
                    <h4 className="text-xl font-bold text-[#06b6d4] mb-1">{phase.title}</h4>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">{phase.duration}</p>
                    <ul className="flex flex-col gap-2">
                      {phase.actions?.map((a, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <ArrowRight size={14} className="text-[#b154f8] shrink-0 mt-0.5" /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Courses */}
            <section>
              <h3 className="flex items-center gap-2 font-bold text-white uppercase mb-6">
                <GraduationCap size={20} className="text-[#06b6d4]" /> Courses &amp; Certifications
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {sortedCourses.map((c, i) => (
                  <a
                    key={i}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0a0a0a] border border-[#222] hover:border-[#06b6d4] rounded-xl p-5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-[#06b6d4]">{c.name}</h4>
                        <p className="text-sm text-gray-500">{c.platform} · {c.duration}</p>
                      </div>
                      <ExternalLink size={16} className="text-gray-500 shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={cn(
                        'text-xs font-bold px-2 py-1 rounded uppercase',
                        c.isFree ? 'bg-green-500/10 text-green-400' : 'bg-[#b154f8]/10 text-[#b154f8]'
                      )}>
                        {c.cost || (c.isFree ? 'Free' : 'Paid')}
                      </span>
                      {c.relevanceTag && (
                        <span className="text-xs text-gray-500">fills: {c.relevanceTag}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>

              {result.certifications?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {result.certifications.map((cert, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#111] border border-[#333] rounded-full px-3 py-1 text-sm text-gray-300">
                      <Award size={14} className="text-[#b154f8]" /> {cert}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Reframe Resume */}
            <section className="bg-gradient-to-b from-[#1a1022] to-black border border-[#b154f8]/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Reframe This Resume for {targetCareer}</h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Let Hydra rewrite your existing resume to emphasize the transferable skills above,
                and save it as a new version in your vault.
              </p>
              <Button
                onClick={handleReframe}
                disabled={reframing}
                className="bg-[#b154f8] hover:bg-[#b154f8]/90 text-white font-bold px-8 py-4"
              >
                {reframing ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                Reframe &amp; Save to Vault
              </Button>
              {reframeSaved && (
                <p className="text-green-400 mt-4 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Saved to your Version Vault.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
