'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ACCEPTED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx'];

interface ScanResult {
  atsScore: number;
  critique: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

type Mode = 'upload' | 'paste';

function scoreColor(score: number) {
  if (score >= 80) return 'text-[#06b6d4]';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export default function ResumeQuickScan() {
  const [mode, setMode] = useState<Mode>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAcceptedFile = (file: File) =>
    ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  const submitFile = useCallback(async (file: File) => {
    if (!isAcceptedFile(file)) {
      setError(`Unsupported file type. Accepted formats: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      return;
    }

    setFileName(file.name);
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/resumes/quick-scan', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'We could not assess your resume.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitPastedText = useCallback(async () => {
    if (!pastedText.trim()) {
      setError('Paste your resume text first.');
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/resumes/quick-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'We could not assess your resume.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pastedText]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) submitFile(file);
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) submitFile(file);
  };

  const reset = () => {
    setFileName(null);
    setPastedText('');
    setError(null);
    setResult(null);
  };

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden border-y border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[400px] bg-[#06b6d4] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-center uppercase">
          Get <span className="text-[#06b6d4]">Assessed</span> Instantly
        </h2>
        <p className="text-gray-400 text-lg text-center mb-12 max-w-2xl mx-auto">
          Drop your resume in. Hydra's AI critiques it, scores it for ATS survivability, and tells you exactly what to fix — before you ever hit "Unleash Hunt Mode."
        </p>

        <div className="bg-[#0a0a0a] border-2 border-[#222] rounded-2xl p-6 md:p-10">
          <div className="flex gap-2 mb-6 justify-center">
            <button
              onClick={() => { setMode('upload'); setError(null); }}
              className={`px-5 py-2 rounded-lg font-bold uppercase text-sm transition-colors ${
                mode === 'upload' ? 'bg-[#06b6d4] text-black' : 'bg-[#161616] text-gray-400 hover:text-white'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => { setMode('paste'); setError(null); }}
              className={`px-5 py-2 rounded-lg font-bold uppercase text-sm transition-colors ${
                mode === 'paste' ? 'bg-[#06b6d4] text-black' : 'bg-[#161616] text-gray-400 hover:text-white'
              }`}
            >
              Paste Text
            </button>
          </div>

          {mode === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-xl py-16 px-6 flex flex-col items-center justify-center text-center transition-colors ${
                isDragging ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-[#333] hover:border-[#555]'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFilePicked}
              />
              {fileName ? <FileText className="mb-4 text-[#06b6d4]" size={48} /> : <UploadCloud className="mb-4 text-gray-500" size={48} />}
              <p className="text-xl font-bold mb-2">
                {fileName ? fileName : 'Drag & drop your resume here'}
              </p>
              <p className="text-gray-500">
                or click to browse — accepts .pdf, .doc, .docx, .txt
              </p>
            </div>
          )}

          {mode === 'paste' && (
            <div className="flex flex-col gap-4">
              <Textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="min-h-[200px] bg-[#111] border-[#333] text-white"
              />
              <Button
                onClick={submitPastedText}
                disabled={loading}
                className="self-end bg-[#06b6d4] text-black font-bold hover:bg-[#06b6d4]/90"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Assess My Resume
              </Button>
            </div>
          )}

          {loading && mode === 'upload' && (
            <div className="flex items-center justify-center gap-3 mt-6 text-[#06b6d4]">
              <Loader2 className="animate-spin" size={20} />
              <span>Hydra's AI is reading your resume...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 mt-6 bg-red-950/40 border border-red-500/30 rounded-lg p-4 text-red-300">
              <AlertTriangle size={20} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-8 border-t border-[#222] pt-8">
              <div className="flex flex-col items-center mb-8">
                <div className={`text-7xl font-black ${scoreColor(result.atsScore)}`}>
                  {result.atsScore}
                </div>
                <div className="text-gray-500 uppercase tracking-widest text-sm mt-1">ATS Score / 100</div>
                <p className="text-center text-gray-300 mt-4 max-w-xl">{result.critique}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-[#06b6d4] mb-3 uppercase text-sm">
                    <CheckCircle2 size={18} /> Strengths
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {result.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-[#b154f8] mb-3 uppercase text-sm">
                    <XCircle size={18} /> Gaps
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {result.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              </div>

              {result.suggestions?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-white mb-3 uppercase text-sm">Suggestions</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {result.suggestions.map((s, i) => <li key={i}>→ {s}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Button onClick={reset} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Scan Another Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
