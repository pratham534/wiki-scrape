import { Body, Controller, Post } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async submitReview(
    @Body() createReviewDto: { name: string; email: string; review: string },
  ) {
    await this.reviewService.saveReview(createReviewDto);
    await this.reviewService.sendEmail(createReviewDto);
    return { message: 'Review submitted successfully' };
  }
}
