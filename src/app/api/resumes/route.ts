import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/resumes - Get all resumes for a user (with their current version)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const resumes = await db.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        folder: true,
        versions: {
          where: { isCurrent: true },
          include: {
            experiences: { orderBy: { order: 'asc' } },
            educations: { orderBy: { order: 'asc' } },
            skills: { orderBy: { order: 'asc' } },
          },
          take: 1,
        },
        _count: { select: { versions: true } },
      },
    });

    const formatted = resumes.map((resume) => {
      const currentVersion = resume.versions[0] ?? null;
      return {
        id: resume.id,
        userId: resume.userId,
        title: resume.title,
        folderName: resume.folder?.name ?? 'General',
        folderId: resume.folderId,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        versionCount: resume._count.versions,
        currentVersion,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

// POST /api/resumes - Create a new resume with an initial version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      folderName,
      fullName,
      email,
      phone,
      location,
      website,
      summary,
      templateId,
      experience,
      education,
      skills,
    } = body;

    if (!userId || !fullName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, fullName, email' },
        { status: 400 }
      );
    }

    // Resolve or create folder
    let folderId: string | null = null;
    if (folderName && folderName !== 'General') {
      const folder = await db.resumeFolder.upsert({
        where: { userId_name: { userId, name: folderName } },
        update: {},
        create: { userId, name: folderName },
      });
      folderId = folder.id;
    }

    // Create the resume container + first version in a transaction
    const resume = await db.resume.create({
      data: {
        userId,
        title: title || 'Untitled Resume',
        folderId,
        versions: {
          create: {
            versionNumber: 1,
            isCurrent: true,
            fullName,
            email,
            phone: phone || '',
            location: location || '',
            website: website || null,
            summary: summary || '',
            templateId: templateId || 'cyber',
            lethalityScore: 0,
            experiences: {
              create: (experience || []).map((exp: any, idx: number) => ({
                title: exp.title || exp.role || '',
                company: exp.company || '',
                location: exp.location || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || 'Present',
                description: exp.description || '',
                order: idx,
              })),
            },
            educations: {
              create: (education || []).map((edu: any, idx: number) => ({
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
              create: (skills || []).map((skill: any, idx: number) => ({
                name: skill.name || '',
                category: skill.category || 'General',
                level: skill.level || 3,
                order: idx,
              })),
            },
          },
        },
      },
      include: {
        folder: true,
        versions: {
          where: { isCurrent: true },
          include: {
            experiences: { orderBy: { order: 'asc' } },
            educations: { orderBy: { order: 'asc' } },
            skills: { orderBy: { order: 'asc' } },
          },
          take: 1,
        },
        _count: { select: { versions: true } },
      },
    });

    return NextResponse.json(
      {
        id: resume.id,
        userId: resume.userId,
        title: resume.title,
        folderName: resume.folder?.name ?? 'General',
        folderId: resume.folderId,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        versionCount: resume._count.versions,
        currentVersion: resume.versions[0] ?? null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
