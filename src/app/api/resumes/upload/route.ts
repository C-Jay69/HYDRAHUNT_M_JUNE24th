import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { ParsingOrchestrator } from '@/services/parsing-orchestrator';
import { ATSAnalyzer } from '@/services/ats-analyzer';

const orchestrator = new ParsingOrchestrator();
const analyzer = new ATSAnalyzer();

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      return '';
    }
  } else if (fileName.endsWith('.docx')) {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      console.error('DOCX parsing error:', error);
      return '';
    }
  } else if (fileName.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || 'demo-user';

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const extractedContents = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        text: await extractText(file),
      }))
    );

    const parsingResult = await orchestrator.processUploads(extractedContents);

    // Ensure the user exists (handles demo-user and real sessions)
    let user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await db.user.upsert({
        where: { email: session?.user?.email || `${userId}@hydrahunt.ai` },
        update: {},
        create: {
          id: userId === 'demo-user' ? 'demo-user' : undefined,
          email: session?.user?.email || `${userId}@hydrahunt.ai`,
          name: session?.user?.name ?? null,
        },
      });
    }

    const { data, confidenceScores, flags } = parsingResult;

    // Create the resume container
    const resume = await db.resume.create({
      data: {
        userId: user.id,
        title: files[0].name.replace(/\.(pdf|docx|txt)$/i, '') || 'Uploaded Resume',
      },
    });

    // Create the initial version with all relational data
    // Prisma relation names: experiences, educations, skills (plural, matching the model)
    const version = await db.resumeVersion.create({
      data: {
        resumeId: resume.id,
        versionNumber: 1,
        isCurrent: true,
        fullName: data.fullName || 'Unknown',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        website: data.website || null,
        summary: data.summary || '',
        templateId: 'cyber',
        experiences: {
          create: (data.experience || []).map((exp: any, idx: number) => ({
            title: exp.role || exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || 'Present',
            description: exp.description || '',
            order: idx,
          })),
        },
        educations: {
          create: (data.education || []).map((edu: any, idx: number) => ({
            school: edu.school || '',
            degree: edu.degree || '',
            field: edu.field || null,
            startDate: edu.startDate || null,
            endDate: edu.endDate || '',
            gpa: edu.gpa || null,
            order: idx,
          })),
        },
        skills: {
          create: (data.skills || []).map((skill: any, idx: number) => ({
            name: skill.name || '',
            category: skill.category || 'General',
            level: skill.level || 3,
            order: idx,
          })),
        },
      },
    });

    // Trigger automatic ATS scoring immediately after creation
    const atsReport = await analyzer.calculateGeneralScore(version as any);
    await db.resumeVersion.update({
      where: { id: version.id },
      data: { atsScore: atsReport.score },
    });

    return NextResponse.json(
      {
        resumeId: resume.id,
        versionId: version.id,
        parsedData: data,
        confidenceScores,
        flags,
        atsScore: atsReport.score,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload and parse resume' },
      { status: 500 }
    );
  }
}
