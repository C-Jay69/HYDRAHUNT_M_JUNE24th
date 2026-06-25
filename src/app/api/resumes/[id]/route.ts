import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/resumes/[id] - Get a single resume with its current version
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = await db.resume.findUnique({
      where: { id },
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

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: resume.id,
      userId: resume.userId,
      title: resume.title,
      folderName: resume.folder?.name ?? 'General',
      folderId: resume.folderId,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      versionCount: resume._count.versions,
      currentVersion: resume.versions[0] ?? null,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

// PUT /api/resumes/[id] - Update a resume's current version
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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
      lethalityScore,
      atsScore,
    } = body;

    // Update the resume container title/folder if provided
    if (title !== undefined || folderName !== undefined) {
      let folderId: string | null | undefined = undefined;
      if (folderName !== undefined) {
        const existing = await db.resume.findUnique({ where: { id }, select: { userId: true } });
        if (existing && folderName && folderName !== 'General') {
          const folder = await db.resumeFolder.upsert({
            where: { userId_name: { userId: existing.userId, name: folderName } },
            update: {},
            create: { userId: existing.userId, name: folderName },
          });
          folderId = folder.id;
        } else {
          folderId = null;
        }
      }

      await db.resume.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(folderId !== undefined && { folderId }),
        },
      });
    }

    // Find the current version
    const currentVersion = await db.resumeVersion.findFirst({
      where: { resumeId: id, isCurrent: true },
    });

    if (!currentVersion) {
      return NextResponse.json(
        { error: 'No current version found for this resume' },
        { status: 404 }
      );
    }

    // Update the current version's scalar fields
    await db.resumeVersion.update({
      where: { id: currentVersion.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(summary !== undefined && { summary }),
        ...(templateId !== undefined && { templateId }),
        ...(lethalityScore !== undefined && { lethalityScore }),
        ...(atsScore !== undefined && { atsScore }),
      },
    });

    // Replace relational arrays if provided
    if (experience !== undefined) {
      await db.experience.deleteMany({ where: { versionId: currentVersion.id } });
      if (experience.length > 0) {
        await db.experience.createMany({
          data: experience.map((exp: any, idx: number) => ({
            versionId: currentVersion.id,
            title: exp.title || exp.role || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || 'Present',
            description: exp.description || '',
            order: idx,
          })),
        });
      }
    }

    if (education !== undefined) {
      await db.education.deleteMany({ where: { versionId: currentVersion.id } });
      if (education.length > 0) {
        await db.education.createMany({
          data: education.map((edu: any, idx: number) => ({
            versionId: currentVersion.id,
            school: edu.school || '',
            degree: edu.degree || '',
            field: edu.field || null,
            startDate: edu.startDate || null,
            endDate: edu.endDate || '',
            gpa: edu.gpa || null,
            order: idx,
          })),
        });
      }
    }

    if (skills !== undefined) {
      await db.skill.deleteMany({ where: { versionId: currentVersion.id } });
      if (skills.length > 0) {
        await db.skill.createMany({
          data: skills.map((skill: any, idx: number) => ({
            versionId: currentVersion.id,
            name: skill.name || '',
            category: skill.category || 'General',
            level: skill.level || 3,
            order: idx,
          })),
        });
      }
    }

    // Return the updated resume
    const updated = await db.resume.findUnique({
      where: { id },
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

    return NextResponse.json({
      id: updated!.id,
      userId: updated!.userId,
      title: updated!.title,
      folderName: updated!.folder?.name ?? 'General',
      folderId: updated!.folderId,
      createdAt: updated!.createdAt,
      updatedAt: updated!.updatedAt,
      versionCount: updated!._count.versions,
      currentVersion: updated!.versions[0] ?? null,
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

// DELETE /api/resumes/[id] - Delete a resume (cascades to versions, experiences, etc.)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.resume.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
