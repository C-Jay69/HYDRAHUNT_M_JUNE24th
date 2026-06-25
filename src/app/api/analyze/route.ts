import { NextRequest, NextResponse } from 'next/server';
import { analyzeResumeATS, analyzeResumeGeneral, beautifyResume, optimizeResume } from '@/lib/ai';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, resumeId, targetJob, analysisType } = body;

    if (!resume && !resumeId) {
      return NextResponse.json(
        { error: 'Resume data or resumeId is required' },
        { status: 400 }
      );
    }

    // If resumeId provided, fetch from database using the normalized schema
    let resumeData = resume;
    if (resumeId && !resume) {
      const dbResume = await db.resume.findUnique({
        where: { id: resumeId },
        include: {
          versions: {
            where: { isCurrent: true },
            include: {
              experiences: { orderBy: { order: 'asc' } },
              educations: { orderBy: { order: 'asc' } },
              skills: { orderBy: { order: 'asc' } },
            },
            take: 1,
          },
        },
      });

      if (!dbResume) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        );
      }

      const version = dbResume.versions[0];
      if (!version) {
        return NextResponse.json(
          { error: 'Resume has no current version' },
          { status: 404 }
        );
      }

      // Flatten into the shape the AI helpers expect
      resumeData = {
        id: dbResume.id,
        title: dbResume.title,
        fullName: version.fullName,
        email: version.email,
        phone: version.phone,
        location: version.location,
        website: version.website,
        summary: version.summary,
        experience: version.experiences,
        education: version.educations,
        skills: version.skills,
      };
    }

    let result: any;

    switch (analysisType) {
      case 'ats':
        result = await analyzeResumeATS(resumeData, targetJob);
        // Update the current version's ATS score
        if (resumeId && result.atsScore) {
          const currentVersion = await db.resumeVersion.findFirst({
            where: { resumeId, isCurrent: true },
          });
          if (currentVersion) {
            await db.resumeVersion.update({
              where: { id: currentVersion.id },
              data: { atsScore: result.atsScore },
            });
          }
        }
        break;

      case 'general':
        result = await analyzeResumeGeneral(resumeData);
        // Update the current version's lethality score
        if (resumeId && result.overallScore) {
          const currentVersion = await db.resumeVersion.findFirst({
            where: { resumeId, isCurrent: true },
          });
          if (currentVersion) {
            await db.resumeVersion.update({
              where: { id: currentVersion.id },
              data: { lethalityScore: result.overallScore },
            });
          }
        }
        break;

      case 'beautify':
        result = await beautifyResume(resumeData);
        break;

      case 'optimize':
        if (!targetJob) {
          return NextResponse.json(
            { error: 'Target job is required for optimization' },
            { status: 400 }
          );
        }
        result = await optimizeResume(resumeData, targetJob, body.improvements || []);
        break;

      default:
        result = await analyzeResumeGeneral(resumeData);
    }

    // Store analysis report
    if (resumeId && (analysisType === 'ats' || analysisType === 'general')) {
      await db.analysisReport.create({
        data: {
          resumeId,
          reportType: analysisType?.toUpperCase() || 'GENERAL',
          targetJob: targetJob || null,
          overallScore: result.atsScore || result.overallScore || 0,
          strengths: JSON.stringify(result.strengths || []),
          weaknesses: JSON.stringify(result.weaknesses || result.formattingIssues || []),
          improvements: JSON.stringify(result.improvements || []),
          detailedFeedback: JSON.stringify(result),
        },
      });
    }

    return NextResponse.json({
      success: true,
      analysisType,
      result,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
