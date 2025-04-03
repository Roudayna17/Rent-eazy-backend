import { forwardRef, Module } from '@nestjs/common';
import { OffreService } from './offre.service';
import { OffreController } from './offre.controller';
import { Offre } from './entities/offre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseModule } from 'src/house/house.module';

@Module({
  controllers: [OffreController],
  providers: [OffreService],
   exports: [OffreService,TypeOrmModule],
   imports: [
    TypeOrmModule.forFeature([Offre]),
    forwardRef(() => HouseModule), // Importez avec forwardRef si nécessaire
  ],})
export class OffreModule {}
