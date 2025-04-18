import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() feedbackData: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackService.create(feedbackData);
  }
  @Get()
async findAll(): Promise<Feedback[]> {
  return this.feedbackService.findAll();
}
@Delete(':id')
async remove(@Param('id') id: number): Promise<void> {
  return this.feedbackService.remove(id);
}
}