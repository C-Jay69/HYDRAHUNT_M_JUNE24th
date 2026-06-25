import { NextRequest, NextResponse } from 'next/server';
import { jobHuntQueue, addStrikeMission } from '@/lib/strike-queue';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, location, resumeId } = await req.json();

    if (!query || !location || !resumeId) {
      return NextResponse.json({ error: 'Missing required fields: query, location, resumeId' }, { status: 400 });
    }

    const job = await addStrikeMission(jobHuntQueue, {
      userId: session.user.id,
      query,
      location,
      resumeId,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Hunt mission initiated. Hydra is scanning for targets...'
    });
  } catch (error: any) {
    console.error('[API:StrikeHunt] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
