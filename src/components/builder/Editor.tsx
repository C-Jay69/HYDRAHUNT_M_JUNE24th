import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ResumeVersion, TemplateId } from '@/types/hydranhunt';
import { ResumePreview } from './Preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface BuilderProps {
  initialData: ResumeVersion;
  onSave: (data: ResumeVersion) => Promise<void>;
}

export const ResumeBuilder: React.FC<BuilderProps> = ({ initialData, onSave }) => {
  const [templateId, setTemplateId] = useState<TemplateId>(initialData.templateId as TemplateId);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData
  });

  const currentValues = watch();

  // Debounced Auto-Save
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (JSON.stringify(currentValues) !== JSON.stringify(initialData)) {
        await handleSave();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentValues]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        ...currentValues,
        templateId
      };
      await onSave(updatedData);
      toast.success("Changes auto-saved");
    } catch (e) {
      toast.error("Auto-save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* LEFT: Editor */}
      <div className="w-1/2 overflow-y-auto p-8 border-r bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Resume Editor</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">{isSaving ? 'Saving...' : 'Saved'}</span>
            <Select value={templateId} onValueChange={(v) => setTemplateId(v as TemplateId)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TemplateId.CLASSIC}>Classic</SelectItem>
                <SelectItem value={TemplateId.MODERN}>Modern</SelectItem>
                <SelectItem value={TemplateId.TECHNICAL}>Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <form className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Personal Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...register('fullName')} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register('email')} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input {...register('location')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Professional Summary</Label>
              <Textarea {...register('summary')} rows={4} />
            </div>
          </section>

          {/* Simplified for this turn: Experience and Education would use Field Arrays */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Experience & Education</h2>
            <p className="text-sm text-slate-500 italic">Drag-and-drop reordering and multi-entry management enabled in full version.</p>
            <Card className="p-4 bg-slate-50 border-dashed">
              <div className="text-center text-slate-400 py-8">
                Modular experience/education blocks would be rendered here.
              </div>
            </Card>
          </section>
        </form>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="w-1/2 bg-slate-200 flex justify-center items-start p-12 overflow-y-auto">
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top transform scale-90">
          <ResumePreview data={currentValues} templateId={templateId} />
        </div>
      </div>
    </div>
  );
};
