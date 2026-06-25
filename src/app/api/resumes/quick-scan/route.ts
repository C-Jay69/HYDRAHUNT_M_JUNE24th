import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ACCEPTED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.doc'];
const MAX_TEXT_LENGTH = 20000;

async function extractText(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (fileName.endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (fileName.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  throw new Error('UNSUPPORTED_FORMAT');
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

async function assessResume(resumeText: string) {
  const aiClient = getAiClient();

  if (!aiClient) {
    return {
      atsScore: 60,
      critique: 'AI assessment is temporarily unavailable. Please try again shortly.',
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };
  }

  const prompt = `
    You are a senior ATS (Applicant Tracking System) auditor and resume critic.
    Assess the following resume text on a 0-100 ATS compatibility scale and give a
    sharp, constructive critique.

    RESUME TEXT:
    ${resumeText.substring(0, MAX_TEXT_LENGTH)}

    Return ONLY valid JSON with this structure:
    {
      "atsScore": number (0-100),
      "critique": "2-3 sentence overall evaluation",
      "strengths": ["3-5 specific strengths"],
      "weaknesses": ["3-5 specific gaps or weaknesses"],
      "suggestions": ["3-5 concrete, actionable improvements"]
    }
  `;

  const response = await aiClient.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json' },
  });

  const text = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return JSON.parse(text);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let resumeText = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      resumeText = (body?.text || '').toString();

      if (!resumeText.trim()) {
        return NextResponse.json({ error: 'No resume text provided.' }, { status: 400 });
      }
    } else {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();
      const isAccepted = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

      if (!isAccepted) {
        return NextResponse.json(
          {
            error: `Unsupported file type. Accepted formats: ${ACCEPTED_EXTENSIONS.join(', ')}`,
          },
          { status: 400 }
        );
      }

      try {
        resumeText = await extractText(file);
      } catch {
        return NextResponse.json(
          {
            error: `We couldn't read that file. Please upload a valid ${ACCEPTED_EXTENSIONS.join(', ')} file.`,
          },
          { status: 400 }
        );
      }

      if (!resumeText.trim()) {
        return NextResponse.json(
          { error: 'We could not extract any text from that file.' },
          { status: 400 }
        );
      }
    }

    const assessment = await assessResume(resumeText);
    return NextResponse.json(assessment, { status: 200 });
  } catch (error: any) {
    console.error('Quick scan failed:', error);
    return NextResponse.json(
      { error: 'Something went wrong while assessing your resume. Please try again.' },
      { status: 500 }
    );
  }
}
