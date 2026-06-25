import { GoogleGenAI } from "@google/genai";
import { ResumeVersion } from '@/types/hydranhunt';

export interface GeneralATSReport {
  score: number;
  critique: string;
  improvements: string[];
  strengths: string[];
  weaknesses: string[];
}

export class ATSAnalyzer {
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Calculates a general ATS score based on resume best practices
   * (quantification, action verbs, structure, and completeness)
   * without requiring a specific job description.
   */
  async calculateGeneralScore(resume: ResumeVersion): Promise<GeneralATSReport> {
    const prompt = `
      You are a senior ATS (Applicant Tracking System) auditor.
      Analyze the following resume based on universal professional standards.

      RESUME DATA:
      ${JSON.stringify(resume)}

      Evaluate the following criteria:
      1. QUANTIFICATION: Does the candidate use metrics, percentages, and numbers to prove impact?
      2. ACTION VERBS: Are bullet points starting with strong, varied action verbs?
      3. STRUCTURE: Is the information logically organized and complete?
      4. CLARITY: Is the summary concise and the experience descriptions clear?

      Return ONLY a valid JSON object with this structure:
      {
        "score": number (0-100),
        "critique": "A 2-3 sentence overall evaluation of the resume's impact",
        "strengths": ["list of 3-5 strengths"],
        "weaknesses": ["list of 3-5 critical gaps or areas for improvement"],
        "improvements": ["list of 3-5 concrete, actionable steps to increase the score"]
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
      console.error("General ATS scoring failed:", error);
      // Return a safe default to avoid breaking the upload flow
      return {
        score: 60,
        critique: "ATS analysis unavailable. Please run a manual audit in the editor.",
        strengths: ["Basic structure present"],
        weaknesses: ["Unable to perform deep AI scan"],
        improvements: ["Try re-uploading or updating your profile"]
      };
    }
  }
}
