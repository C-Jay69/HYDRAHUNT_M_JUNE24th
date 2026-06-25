import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Target } from 'lucide-react';

interface MatchGaugeProps {
  score: number;
}

export const MatchGauge: React.FC<MatchGaugeProps> = ({ score }) => {
  const getColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Simple SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={364.4}
            strokeDashoffset={364.4 - (364.4 * score) / 100}
            strokeLinecap="round"
            className={getColor()}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}%</span>
        </div>
      </div>
      <div className="text-center">
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          score >= 80 ? 'bg-green-100 text-green-700' :
          score >= 50 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {score >= 80 ? 'Strong Match' : score >= 50 ? 'Average Match' : 'Weak Match'}
        </span>
      </div>
    </div>
  );
};

export const KeywordHeatmap: React.FC<{ keywords: { found: string[], missing: string[] } }> = ({ keywords }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
        <Target className="w-4 h-4" />
        Keyword Analysis
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.found.map((k, i) => (
          <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {k}
          </Badge>
        ))}
        {keywords.missing.map((k, i) => (
          <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {k}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export const GapAnalysisList: React.FC<{ suggestions: any[] }> = ({ suggestions }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
        <AlertCircle className="w-4 h-4" />
        Critical Gaps & Improvements
      </div>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <Card key={i} className="overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-3 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">{s.field}</div>
                <div className="text-sm text-slate-700 italic line-through opacity-50">{s.original}</div>
                <div className="text-sm font-medium text-slate-900">{s.suggestion}</div>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase">
                {s.impact}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
