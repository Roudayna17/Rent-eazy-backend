import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
// eslint-disable-next-line prettier/prettier
@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [TypeOrmModule.forFeature([Client, Commentaire, Reservation]),
],
  exports: [ClientService,TypeOrmModule],  

})
export class ClientModule {}
