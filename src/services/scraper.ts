import puppeteer from 'puppeteer';
import { MatchOptimizer } from '@/services/optimizer';
import { ResumeVersion } from '@/types/hydranhunt';

export interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobUrl: string;
  description: string;
}

export class JobScraper {
  private optimizer: MatchOptimizer;

  constructor() {
    this.optimizer = new MatchOptimizer();
  }

  /**
   * Scrape jobs from a search query.
   * Note: In a production environment, we would use rotating proxies
   * and stealth plugins to avoid detection.
   */
  async hunt(query: string, location: string, resume: ResumeVersion): Promise<{ job: ScrapedJob, fitScore: number }[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();

      // For the purpose of this implementation, we'll focus on a generic search
      // that targets a common job aggregator format.
      const searchUrl = `https://www.google.com/search?q=jobs+${encodeURIComponent(query)}+in+${encodeURIComponent(location)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      // Extract job cards from the Google Jobs aggregator
      const jobs = await page.evaluate(() => {
        const results: any[] = [];
        const cards = document.querySelectorAll('.vYpS9e'); // Example selector for job cards

        cards.forEach(card => {
          const title = card.querySelector('.sSPhNf')?.textContent || 'Unknown Title';
          const company = card.querySelector('.S7Sbe')?.textContent || 'Unknown Company';
          const location = card.querySelector('.a3Sia')?.textContent || 'Remote';
          const link = (card.querySelector('a') as HTMLAnchorElement)?.href || '';

          results.push({ title, company, location, jobUrl: link });
        });
        return results;
      });

      const analyzedJobs: { job: ScrapedJob & { description: string }; fitScore: number }[] = [];

      for (const job of jobs) {
        // 1. Get the full job description by navigating to the URL
        const description = await this.extractDescription(page, job.jobUrl);

        // 2. Use our Sprint 2 Optimizer to calculate a "Fit Score"
        const analysis = await this.optimizer.calculateMatchScore(resume, description);

        analyzedJobs.push({
          job: { ...job, description },
          fitScore: analysis.matchScore
        });
      }

      return analyzedJobs;
    } finally {
      await browser.close();
    }
  }

  private async extractDescription(page: any, url: string): Promise<string> {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      const text = await page.evaluate(() => {
        // Attempt to find the main content area to avoid noise
        const selectors = ['div[class*="description"]', 'div[class*="job-details"]', 'body'];
        for (const s of selectors) {
          const el = document.querySelector(s);
          if (el && (el as HTMLElement).innerText.length > 200) return (el as HTMLElement).innerText;
        }
        return (document.body as HTMLElement).innerText;
      });
      return text;
    } catch (e) {
      console.error(`Failed to extract description from ${url}:`, e);
      return "Description unavailable";
    }
  }
}
