import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { House } from './entities/house.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lessor } from 'src/lessor/entities/lessor.entity';
import { PicturesModule } from 'src/pictures/pictures.module';
import { EquipementModule } from 'src/equipement/equipement.module';
import { CharacteristicModule } from 'src/characteristic/characteristic.module';

@Module({
  controllers: [HouseController],
  providers: [HouseService],
  exports: [HouseService],
    imports:[TypeOrmModule.forFeature([House,Lessor,]),PicturesModule,EquipementModule,CharacteristicModule]
})
export class HouseModule {}
