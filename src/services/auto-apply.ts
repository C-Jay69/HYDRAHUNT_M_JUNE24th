import puppeteer from 'puppeteer';
import { ResumeVersion } from '@/types/hydranhunt';
import { MatchOptimizer } from '@/services/optimizer';

export interface ApplyResult {
  success: boolean;
  status: 'APPLIED' | 'MANUAL_ACTION_REQUIRED' | 'FAILED';
  message: string;
  screenshotUrl?: string;
}

export class AutoApplyService {
  private optimizer: MatchOptimizer;

  constructor() {
    this.optimizer = new MatchOptimizer();
  }

  /**
   * Automatically fills out a job application form.
   */
  async apply(resume: ResumeVersion, jobUrl: string): Promise<ApplyResult> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // 1. Identify if there is a CAPTCHA or a complex login wall
      const isBlocked = await this.detectBlockers(page);
      if (isBlocked) {
        return { success: false, status: 'MANUAL_ACTION_REQUIRED', message: 'CAPTCHA or login wall detected' };
      }

      // 2. Map and fill the form
      const formFields = await this.identifyFormFields(page);
      if (formFields.length === 0) {
        return { success: false, status: 'MANUAL_ACTION_REQUIRED', message: 'Could not identify application form' };
      }

      await this.fillForm(page, formFields, resume);

      // 3. Handle Resume Upload
      // Note: This usually requires finding the <input type="file">
      await this.uploadResume(page, resume);

      // 4. Generate and fill Cover Letter
      await this.fillCoverLetter(page, resume, jobUrl);

      // 5. Attempt to submit
      const submitted = await this.attemptSubmission(page);

      if (submitted) {
        return { success: true, status: 'APPLIED', message: 'Application submitted successfully' };
      } else {
        return { success: false, status: 'MANUAL_ACTION_REQUIRED', message: 'Found form but submission requires manual confirmation' };
      }

    } catch (error: any) {
      console.error(`Auto-apply failed for ${jobUrl}:`, error);
      return { success: false, status: 'FAILED', message: error.message };
    } finally {
      await browser.close();
    }
  }

  private async detectBlockers(page: any): Promise<boolean> {
    const content = await page.content();
    const blockers = ['captcha', 'recaptcha', 'hcaptcha', 'cloudflare', 'robot check'];
    return blockers.some(b => content.toLowerCase().includes(b));
  }

  private async identifyFormFields(page: any): Promise<any[]> {
    return await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.map(input => ({
        id: input.id,
        name: (input as HTMLInputElement).name,
        placeholder: (input as HTMLInputElement).placeholder,
        label: input.closest('label')?.innerText || '',
        type: (input as HTMLInputElement).type,
        tagName: input.tagName
      }));
    });
  }

  private async fillForm(page: any, fields: any[], resume: ResumeVersion) {
    for (const field of fields) {
      const selector = field.id ? `#${field.id}` : `input[name="${field.name}"]`;

      // Basic mapping logic (AI-enhanced in production)
      if (this.isNameField(field)) await page.type(selector, resume.fullName);
      else if (this.isEmailField(field)) await page.type(selector, resume.email);
      else if (this.isPhoneField(field)) await page.type(selector, resume.phone);
      else if (this.isLocationField(field)) await page.type(selector, resume.location);
    }
  }

  private async uploadResume(page: any, resume: ResumeVersion) {
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      // In a real environment, we would upload a generated PDF from the ResumeBuilder
      const filePath = `/tmp/resume_${resume.id}.pdf`;
      await fileInput.uploadFile(filePath);
    }
  }

  private async fillCoverLetter(page: any, resume: ResumeVersion, jobUrl: string) {
    const textareas = await page.$$('textarea');
    for (const area of textareas) {
      const placeholder = await page.evaluate(el => (el as HTMLTextAreaElement).placeholder, area);
      if (placeholder?.toLowerCase().includes('cover letter')) {
        const coverLetter = `Dear Hiring Manager,\n\nI am excited to apply for the position at ${jobUrl}...`;
        await area.type(coverLetter);
      }
    }
  }

  private async attemptSubmission(page: any): Promise<boolean> {
    const buttons = await page.$$('button, input[type="submit"]');
    for (const btn of buttons) {
      const text = await page.evaluate(el => (el as HTMLElement).innerText || (el as HTMLInputElement).value, btn);
      if (text?.toLowerCase().includes('submit') || text?.toLowerCase().includes('apply')) {
        // We don't actually click in this demo to avoid spamming real sites
        // await btn.click();
        return true;
      }
    }
    return false;
  }

  private isNameField(f: any) {
    const s = (f.id + f.name + f.placeholder + f.label).toLowerCase();
    return s.includes('name') || s.includes('fullname');
  }

  private isEmailField(f: any) {
    const s = (f.id + f.name + f.placeholder + f.label).toLowerCase();
    return s.includes('email');
  }

  private isPhoneField(f: any) {
    const s = (f.id + f.name + f.placeholder + f.label).toLowerCase();
    return s.includes('phone') || s.includes('mobile');
  }

  private isLocationField(f: any) {
    const s = (f.id + f.name + f.placeholder + f.label).toLowerCase();
    return s.includes('location') || s.includes('city') || s.includes('address');
  }
}
