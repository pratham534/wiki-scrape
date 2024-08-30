import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { ScrapedData, ScrapedDataSchema } from '../schemas/scraped-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScrapedData.name, schema: ScrapedDataSchema },
    ]),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
