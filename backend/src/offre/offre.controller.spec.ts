import { Test, TestingModule } from '@nestjs/testing';
import { OffreController } from './offre.controller';
import { OffreService } from './offre.service';

describe('OffreController', () => {
  let controller: OffreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffreController],
      providers: [OffreService],
    }).compile();

    controller = module.get<OffreController>(OffreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
