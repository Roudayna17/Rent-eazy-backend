import { Test, TestingModule } from '@nestjs/testing';
import { LessorController } from './lessor.controller';
import { LessorService } from './lessor.service';

describe('LessorController', () => {
  let controller: LessorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessorController],
      providers: [LessorService],
    }).compile();

    controller = module.get<LessorController>(LessorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
