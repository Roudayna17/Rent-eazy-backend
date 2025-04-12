// src/reservation/reservation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { Client } from 'src/client/entities/client.entity';
import { Offre } from 'src/offre/entities/offre.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Client, Offre])
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService]
})
export class ReservationModule {}