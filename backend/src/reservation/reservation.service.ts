import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Client } from '../client/entities/client.entity';
import { Offre } from '../offre/entities/offre.entity';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
        @InjectRepository(Offre)
        private offreRepository: Repository<Offre>,
    ) {}

    async create(dto: CreateReservationDto): Promise<Reservation> {
      console.log('Creating reservation with DTO:', dto);
      
      const client = await this.clientRepository.findOne({ where: { id: dto.clientId } });
      console.log('Found client:', client);
      
      const offre = await this.offreRepository.findOne({ 
          where: { id: dto.offreId },
          relations: ['house']
      });
      console.log('Found offre:', offre);
  
      if (!client) {
          console.error(`Client not found with ID: ${dto.clientId}`);
          throw new NotFoundException(`Client with ID ${dto.clientId} not found`);
      }
      if (!offre) {
          console.error(`Offre not found with ID: ${dto.offreId}`);
          throw new NotFoundException(`Offre with ID ${dto.offreId} not found`);
      }
  
      const reservation = this.reservationRepository.create({
          client,
          offre,
          status: dto.status || false
      });
      console.log('Created reservation object:', reservation);
  
      await this.reservationRepository.save(reservation);
      console.log('Reservation saved with ID:', reservation.id);
      
      // Charger les relations pour la réponse
      const savedReservation = await this.reservationRepository.findOne({
          where: { id: reservation.id },
          relations: ['client', 'offre', 'offre.house']
      });
      
      console.log('Final reservation object with relations:', savedReservation);
      return savedReservation;
  }

    async findAll(): Promise<Reservation[]> {
        return this.reservationRepository.find({ 
            relations: ['client', 'offre', 'offre.house']
        });
    }

    async delete(id: number): Promise<void> {
        const result = await this.reservationRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Reservation with ID ${id} not found`);
        }
    }

    // reservation.service.ts
async findByLessor(lessorId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
        where: { offre: { house: { lessor: { id: lessorId } } } },
        relations: ['client', 'offre', 'offre.house']
    });
}

async acceptReservation(id: number, message?: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: ['client', 'offre', 'offre.house']
    });

    if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    reservation.status = true;
    reservation.decisionDate = new Date();
    reservation.decisionMessage = message || "Votre réservation a été acceptée";
    return this.reservationRepository.save(reservation);
}
// Dans reservation.service.ts
async rejectReservation(id: number, message?: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: ['client', 'offre', 'offre.house']
    });

    if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    reservation.status = false;
    reservation.isRejected = true; // Ajoutez cette ligne
    reservation.decisionDate = new Date();
    reservation.decisionMessage = message || "Votre réservation a été refusée";
    return this.reservationRepository.save(reservation);
}
async getClientReservations(clientId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
        where: { client: { id: clientId } },
        relations: ['offre', 'offre.house'],
        order: { createdAt: 'DESC' }
    });
}

async markAsRead(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    reservation.isRead = true;
    return this.reservationRepository.save(reservation);
}

async getUnreadCount(clientId: number): Promise<number> {
    return this.reservationRepository.count({
        where: { 
            client: { id: clientId },
            isRead: false
        }
    });
}
}