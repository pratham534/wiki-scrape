import { Controller, Get, Query } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scrape')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get()
  async scrape(@Query('url') url: string) {
    if (!url) {
      throw new Error('URL parameter is required');
    }
    return await this.scrapingService.scrapeWebsite(url);
  }
}
