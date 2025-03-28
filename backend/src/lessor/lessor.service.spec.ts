import { Test, TestingModule } from '@nestjs/testing';
import { LessorService } from './lessor.service';

describe('LessorService', () => {
  let service: LessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessorService],
    }).compile();

    service = module.get<LessorService>(LessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
