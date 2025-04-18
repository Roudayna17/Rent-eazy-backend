import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(feedbackData: Partial<Feedback>): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(feedbackData);
    return this.feedbackRepository.save(feedback);
  }
  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({ order: { createdAt: 'DESC' } });
  }
  async remove(id: number): Promise<void> {
    await this.feedbackRepository.delete(id);
  }
  
}