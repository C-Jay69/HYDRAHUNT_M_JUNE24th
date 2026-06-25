import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { versionId, field, newValue } = body;

    if (!versionId || !field || newValue === undefined) {
      return NextResponse.json(
        { error: 'versionId, field, and newValue are required' },
        { status: 400 }
      );
    }

    // We need to handle different types of updates since our schema is normalized
    // Field format: 'personal.fullName' or 'experience[0].description'

    if (field.startsWith('personal.')) {
      const personalField = field.split('.')[1];
      await db.resumeVersion.update({
        where: { id: versionId },
        data: { [personalField]: newValue },
      });
    } else if (field.startsWith('experience')) {
      const match = field.match(/experience\[(\d+)\]\.(.+)/);
      if (!match) throw new Error('Invalid experience field format');
      const [_, index, expField] = match;

      const experience = await db.experience.findFirst({
        where: { versionId, order: parseInt(index) },
      });

      if (!experience) throw new Error('Experience entry not found');

      await db.experience.update({
        where: { id: experience.id },
        data: { [expField]: newValue },
      });
    } else if (field.startsWith('education')) {
      const match = field.match(/education\[(\d+)\]\.(.+)/);
      if (!match) throw new Error('Invalid education field format');
      const [_, index, eduField] = match;

      const education = await db.education.findFirst({
        where: { versionId, order: parseInt(index) },
      });

      if (!education) throw new Error('Education entry not found');

      await db.education.update({
        where: { id: education.id },
        data: { [eduField]: newValue },
      });
    } else {
      return NextResponse.json({ error: 'Unsupported field for surgical update' }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Surgical update error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
