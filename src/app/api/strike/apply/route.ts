import { NextRequest, NextResponse } from 'next/server';
import { autoApplyQueue, addStrikeMission } from '@/lib/strike-queue';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobUrl, resumeId } = await req.json();

    if (!jobUrl || !resumeId) {
      return NextResponse.json({ error: 'Missing required fields: jobUrl, resumeId' }, { status: 400 });
    }

    const job = await addStrikeMission(autoApplyQueue, {
      userId: session.user.id,
      jobUrl,
      resumeId,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Auto-Apply strike initiated. Deploying payload...'
    });
  } catch (error: any) {
    console.error('[API:StrikeApply] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
