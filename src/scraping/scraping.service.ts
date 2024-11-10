import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapedData } from '../schemas/scraped-data.schema';
import puppeteer from 'puppeteer';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    @InjectModel(ScrapedData.name)
    private readonly scrapedDataModel: Model<ScrapedData>,
  ) {}

  async scrapeWebsite(url: string): Promise<any> {
    // Check if data is already in the database
    const existingData = await this.scrapedDataModel.findOne({ url }).exec();
    if (existingData) {
      this.logger.log('Using existing data from database');
      return existingData.data;
    }

    // Scrape the website using Puppeteer
    try {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

      const data = await page.evaluate(() => {
        const tables = document.querySelectorAll('table.wikitable');
        const tablesData = [];

        Array.from(tables).forEach((table, index) => {
          // Generate a unique identifier based on the index or use an attribute if available
          const tableId = table.id || `table_${index}`;

          const tableData = { id: tableId, rows: [] };
          const rows = table.querySelectorAll('tr');

          Array.from(rows).forEach((row) => {
            const rowData = [];
            const cells = row.querySelectorAll('td, th');

            Array.from(cells).forEach((cell) => {
              rowData.push((cell as HTMLElement).innerText.trim());
            });

            tableData.rows.push(rowData);
          });

          tablesData.push(tableData);
        });

        return tablesData;
      });

      await browser.close();

      // Save the scraped data to the database
      const scrapedData = new this.scrapedDataModel({ url, data });
      await scrapedData.save();

      this.logger.log('Scraped data saved to database');
      return data;
    } catch (error) {
      this.logger.error('Error scraping website', error.stack);
      throw new HttpException(
        'Failed to scrape website',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
