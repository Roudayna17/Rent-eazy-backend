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

    async findByLessor(lessorId: number): Promise<Reservation[]> {
        // Ici, on recherche les réservations dont l'offre est liée à une maison dont le bailleur (lessor) a l'ID fourni.
        return this.reservationRepository.find({
          where: { offre: { house: { lessor: { id: lessorId } } } },
          relations: ['client', 'offre', 'offre.house'],
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
async getReservationStatistics() {
    const statusStats = await this.reservationRepository
        .createQueryBuilder('reservation')
        .select('reservation.status as status')
        .addSelect('COUNT(*) as count')
        .groupBy('reservation.status')
        .getRawMany();

    const monthlyStats = await this.reservationRepository
        .createQueryBuilder('reservation')
        .select("DATE_TRUNC('month', reservation.createdAt)", 'month')
        .addSelect('COUNT(*)', 'count')
        .groupBy('month')
        .orderBy('month', 'DESC')
        .limit(12)
        .getRawMany();

    // Get average response time
    const avgResponseTime = await this.reservationRepository
        .createQueryBuilder('reservation')
        .select('AVG(EXTRACT(EPOCH FROM (reservation.decisionDate - reservation.createdAt)))/3600', 'averageHours')
        .where('reservation.decisionDate IS NOT NULL')
        .getRawOne();

    // Get acceptance rate
   // Get acceptance rate
const acceptanceRate = await this.reservationRepository
.createQueryBuilder('reservation')
.select([
  'COUNT(*) FILTER (WHERE status = true)::float / NULLIF(COUNT(*), 0)::float * 100 AS "acceptanceRate"',
  'COUNT(*) AS total',
  'COUNT(*) FILTER (WHERE status = true) AS accepted',
  'COUNT(*) FILTER (WHERE status = false) AS rejected'
])
.getRawOne();


    return {
        statusDistribution: statusStats,
        monthlyTrends: monthlyStats,
        averageResponseTime: avgResponseTime?.averageHours || 0,
        acceptanceMetrics: acceptanceRate
    };
}
async getReservationsPerLessor() {
    return this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoin('reservation.offre', 'offre')
        .leftJoin('offre.house', 'house')
        .leftJoin('house.lessor', 'lessor')
        .select('lessor.id', 'lessorId')
        .addSelect('lessor.firstName', 'lessorName')
        .addSelect('COUNT(reservation.id)', 'reservation_count')
        .addSelect('COUNT(*) FILTER (WHERE reservation.status = true)', 'accepted_reservations')
        .groupBy('lessor.id')
        .addGroupBy('lessor.firstName')
        .getRawMany();
}



async getReservationTrends() {
    return this.reservationRepository
        .createQueryBuilder('reservation')
        .select([
            "DATE_TRUNC('day', reservation.createdat) AS date",
            "COUNT(*) AS totalCount",
            "COUNT(*) FILTER (WHERE status = true) AS acceptedCount",
            "COUNT(*) FILTER (WHERE status = false) AS rejectedCount",
          ])
          .groupBy('date')
          .orderBy('date', 'DESC')
          .limit(30)
          .getRawMany();
}
async getRecentReservationsWithDetails(limit: number = 5) {
    return this.reservationRepository.find({
        relations: ['client', 'offre', 'offre.house'],
        order: { createdAt: 'DESC' },
        take: limit
    });
}
}