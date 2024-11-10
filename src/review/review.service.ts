import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import * as nodemailer from 'nodemailer';
import { Logger } from '@nestjs/common';
require('dotenv').config();

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async saveReview(createReviewDto: {
    name: string;
    email: string;
    review: string;
  }): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    // this.logger.log(createdReview);
    return createdReview.save();
  }

  async sendEmail(createReviewDto: {
    name: string;
    email: string;
    review: string;
  }) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      // logger: true,
      // debug: true,
    });
    const mailOptions = {
      from: createReviewDto.email,
      to: process.env.EMAIL_USER,
      subject: 'New Review Submitted',
      text: `Name: ${createReviewDto.name}\nEmail: ${createReviewDto.email}\nReview: ${createReviewDto.review}`,
    };
    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Review submitted successfully' };
    } catch (error) {
      return { message: 'Error sending email' };
    }
  }
}
