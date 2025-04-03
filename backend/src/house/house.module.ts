import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { House } from './entities/house.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lessor } from 'src/lessor/entities/lessor.entity';
import { PicturesModule } from 'src/pictures/pictures.module';
import { EquipementModule } from 'src/equipement/equipement.module';
import { CharacteristicModule } from 'src/characteristic/characteristic.module';
import { OffreModule } from 'src/offre/offre.module';
import { Offre } from 'src/offre/entities/offre.entity';
import { Equipment } from 'src/equipement/entities/equipement.entity';
import { Characteristic } from 'src/characteristic/entities/characteristic.entity';
import { Picture } from 'src/pictures/entities/picture.entity';

@Module({
  controllers: [HouseController],
  providers: [HouseService],
  exports: [HouseService, TypeOrmModule.forFeature([House])], // Exportez correctement
    imports:[TypeOrmModule.forFeature([House,Lessor,Offre,Equipment,Characteristic,Picture]),PicturesModule,EquipementModule,CharacteristicModule,OffreModule]
})
export class HouseModule {}
