import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { MatchOptimizer } from '@/services/optimizer';
import { ResumeVersion } from '@/types/hydranhunt';

const optimizer = new MatchOptimizer();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, versionId, jobDescription } = body;

    if (!resumeId || !versionId || !jobDescription) {
      return NextResponse.json(
        { error: 'resumeId, versionId, and jobDescription are required' },
        { status: 400 }
      );
    }

    // 1. Fetch the specific resume version
    const version = await db.resumeVersion.findUnique({
      where: { id: versionId },
      include: {
        experiences: true,
        educations: true,
        skills: true,
      },
    });

    if (!version) {
      return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
    }

    // Transform DB model to frontend ResumeVersion type
    const resumeData: ResumeVersion = {
      ...version,
      createdAt: version.createdAt.toISOString(),
      updatedAt: version.updatedAt.toISOString(),
      experience: version.experiences.map((e) => ({ ...e, location: e.location ?? undefined })),
      education: version.educations.map((e) => ({
        ...e,
        field: e.field ?? undefined,
        startDate: e.startDate ?? undefined,
        gpa: e.gpa ?? undefined,
      })),
      skills: version.skills,
    };

    // 2. Run the Match Score analysis
    const analysis = await optimizer.calculateMatchScore(resumeData, jobDescription);

    // 3. Store as an AnalysisReport for history
    await db.analysisReport.create({
      data: {
        resumeId,
        reportType: 'JOB_SPECIFIC',
        targetJob: jobDescription.substring(0, 255),
        overallScore: analysis.matchScore,
        strengths: JSON.stringify(analysis.strengths),
        weaknesses: JSON.stringify(analysis.gaps),
        improvements: JSON.stringify(analysis.specificSuggestions),
        detailedFeedback: JSON.stringify(analysis),
      },
    });

    return NextResponse.json({
      success: true,
      analysis,
    });

  } catch (error: any) {
    console.error('Match analysis error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
