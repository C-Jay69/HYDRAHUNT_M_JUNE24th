import { GoogleGenAI } from "@google/genai";
import { ResumeData, ResumeVersion } from '../types/hydranhunt';

interface ParsingResult {
  data: Partial<ResumeVersion>;
  confidenceScores: {
    personal: number;
    experience: number;
    education: number;
    skills: number;
    extra: number; // Certs, Projects, Awards
  };
  flags: string[];
}

export class ParsingOrchestrator {
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({ apiKey });
    }
  }

  async processUploads(filesContent: { filename: string, text: string }[]): Promise<ParsingResult> {
    if (filesContent.length === 0) {
      throw new Error("No content provided for parsing");
    }

    const combinedText = filesContent
      .map(f => `--- FILE: ${f.filename} ---\n${f.text}`)
      .join('\n\n');

    const structuredData = await this.structureAndMerge(combinedText);

    if (!structuredData) {
      throw new Error("AI failed to structure the resume data");
    }

    const { confidenceScores, flags } = await this.calculateConfidence(combinedText, structuredData);

    return {
      data: structuredData,
      confidenceScores,
      flags
    };
  }

  private async structureAndMerge(text: string): Promise<Partial<ResumeVersion> | null> {
    const prompt = `
      You are a world-class resume parser. I will provide you with text extracted from one or more files.
      Your goal is to create a SINGLE, unified, and deduplicated resume object.

      REQUIREMENTS:
      1. DEDUPLICATE: If the same job or degree appears in multiple files, merge them into one entry. Use the most detailed version.
      2. RESOLVE CONFLICTS: If dates or titles differ slightly, prefer the one that looks more professional or recent.
      3. CATEGORIZE EVERYTHING: Extract the following fields exactly:
         - Personal: fullName, email, phone, location, website, summary.
         - Experience: Array of { company, role, location, startDate, endDate, description }.
         - Education: Array of { school, degree, field, startDate, endDate, gpa }.
         - Skills: Array of { name, category (Technical/Soft), level (1-5) }.
         - Certifications: Array of { name, issuer, date }.
         - Projects: Array of { title, description, link, technologies [] }.
         - Awards: Array of { title, issuer, date }.

      4. STRUCTURE: Return ONLY valid JSON matching this structure:
      {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "website": "string",
        "summary": "string",
        "experience": [],
        "education": [],
        "skills": [],
        "certifications": [],
        "projects": [],
        "awards": []
      }

      INPUT TEXT:
      ${text}
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

      const responseText = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Structuring and Merging failed:", error);
      return null;
    }
  }

  private async calculateConfidence(rawText: string, structuredData: any): Promise<{ confidenceScores: any, flags: string[] }> {
    const prompt = `
      Analyze the following structured resume data against the raw extracted text.
      Determine how accurately the data was extracted and identify ambiguities.

      RAW TEXT:
      ${rawText.substring(0, 15000)}

      STRUCTURED DATA:
      ${JSON.stringify(structuredData)}

      Return ONLY JSON:
      {
        "confidenceScores": {
          "personal": number (0-100),
          "experience": number (0-100),
          "education": number (0-100),
          "skills": number (0-100),
          "extra": number (0-100)
        },
        "flags": ["List of specific ambiguities or missing critical info"]
      }
    `;

    try {
      if (!this.aiClient) {
        return {
          confidenceScores: { personal: 70, experience: 70, education: 70, skills: 70, extra: 70 },
          flags: ["AI client not initialized — confidence scores unavailable"]
        };
      }

      const response = await this.aiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      const text = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return JSON.parse(text);
    } catch (error) {
      console.error("Confidence calculation failed:", error);
      return {
        confidenceScores: { personal: 70, experience: 70, education: 70, skills: 70, extra: 70 },
        flags: ["Could not calculate confidence scores"]
      };
    }
  }
}
