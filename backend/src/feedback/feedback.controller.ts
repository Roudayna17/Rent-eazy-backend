import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() feedbackData: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackService.create(feedbackData);
  }
}