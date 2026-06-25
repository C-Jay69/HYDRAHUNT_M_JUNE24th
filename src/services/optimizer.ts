import { GoogleGenAI } from "@google/genai";
import { ResumeVersion } from '@/types/hydranhunt';

export interface MatchAnalysis {
  matchScore: number;
  keywordAnalysis: {
    found: string[];
    missing: string[];
    score: number;
  };
  strengths: string[];
  gaps: string[];
  specificSuggestions: {
    field: string;
    original: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export class MatchOptimizer {
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Calculates a precise match score between a resume version and a job description.
   */
  async calculateMatchScore(resume: ResumeVersion, jobDescription: string): Promise<MatchAnalysis> {
    const prompt = `
      You are an expert technical recruiter and ATS algorithm.
      Compare the following resume against the provided job description.

      RESUME DATA:
      ${JSON.stringify(resume)}

      JOB DESCRIPTION:
      ${jobDescription}

      Return ONLY a valid JSON object with this structure:
      {
        "matchScore": number (0-100),
        "keywordAnalysis": {
          "found": ["list of critical keywords present"],
          "missing": ["list of critical missing keywords"],
          "score": number (0-100)
        },
        "strengths": ["list of reasons why this candidate is a good fit"],
        "gaps": ["list of specific missing qualifications or experience gaps"],
        "specificSuggestions": [
          {
            "field": "e.g., 'experience[0].description'",
            "original": "the original text",
            "suggestion": "the improved text to better match the job",
            "impact": "high or medium or low"
          }
        ]
      }
    `;

    try {
      if (!this.aiClient) {
        throw new Error("AI client not initialized — GEMINI_API_KEY is missing.");
      }

      const response = await this.aiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      const text = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return JSON.parse(text);
    } catch (error) {
      console.error("Match scoring failed:", error);
      throw new Error("AI failed to calculate match score");
    }
  }
}
