import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Suggestion {
  field: string;
  original: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

interface DiffViewerProps {
  versionId: string;
  suggestions: Suggestion[];
  onUpdateSuccess: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ versionId, suggestions, onUpdateSuccess }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAccept = async (suggestion: Suggestion) => {
    setUpdatingId(suggestion.field);
    try {
      const response = await fetch('/api/resumes/version/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          field: suggestion.field,
          newValue: suggestion.suggestion
        }),
      });

      if (!response.ok) throw new Error('Failed to apply change');

      toast.success(`Applied improvement to ${suggestion.field}`);
      onUpdateSuccess(); // Refresh the analysis and resume data
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-lg border-2 border-dashed">
        <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No specific improvements suggested. Your resume is looking sharp!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          Surgical AI Optimizations
        </h3>
        <Badge variant="outline" className="text-xs">
          {suggestions.length} Suggestions
        </Badge>
      </div>

      <div className="grid gap-4">
        {suggestions.map((s, i) => (
          <Card key={i} className="overflow-hidden border-l-4 border-l-blue-500 transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Field: {s.field}
                </div>
                <Badge variant="outline" className={`text-[10px] ${
                  s.impact === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                  s.impact === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                  'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {s.impact} Impact
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Current</div>
                  <div className="text-sm text-slate-600 line-through opacity-60">{s.original}</div>
                </div>

                <div className="p-3 bg-blue-50 rounded border border-blue-100 relative">
                  <div className="text-[10px] text-blue-400 uppercase font-bold mb-1">AI Suggestion</div>
                  <div className="text-sm text-slate-900 font-medium">{s.suggestion}</div>
                  <ArrowRight className="w-3 h-3 absolute -left-4 top-1/2 -translate-y-1/2 text-blue-300 hidden md:block" />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {}} // In a full version, this would hide the suggestion
                >
                  <X className="w-3 h-3 mr-1" /> Ignore
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-700"
                  disabled={updatingId === s.field}
                  onClick={() => handleAccept(s)}
                >
                  {updatingId === s.field ? (
                    <span className="animate-pulse">Applying...</span>
                  ) : (
                    <><Check className="w-3 h-3 mr-1" /> Accept Change</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
