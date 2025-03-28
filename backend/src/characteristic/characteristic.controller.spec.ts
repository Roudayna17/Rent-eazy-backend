import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicController } from './characteristic.controller';
import { CharacteristicService } from './characteristic.service';

describe('CharacteristicController', () => {
  let controller: CharacteristicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacteristicController],
      providers: [CharacteristicService],
    }).compile();

    controller = module.get<CharacteristicController>(CharacteristicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
