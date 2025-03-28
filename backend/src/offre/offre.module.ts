import { Module } from '@nestjs/common';
import { OffreService } from './offre.service';
import { OffreController } from './offre.controller';
import { Offre } from './entities/offre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OffreController],
  providers: [OffreService],
   exports: [OffreService],
      imports:[TypeOrmModule.forFeature([Offre])]
})
export class OffreModule {}
