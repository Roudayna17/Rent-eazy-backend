import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './entities/client.entity'; // Import correct de l'entité
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, 
    @InjectRepository(Commentaire)
    private commentRepository: Repository<Commentaire>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    ) {}

  // Méthode pour créer un client
  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto); // Crée un objet client

    // Hachage du mot de passe
    client.password = await this.hashPassword(client.password);
    console.log('Client après hachage du mot de passe :', client.password);

    return this.clientRepository.save(client); // Sauvegarde dans la base de données
  }

  // Méthode pour hacher un mot de passe
  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 15; // Définir le nombre de tours de sel pour le hachage
    return bcrypt.hash(password, saltOrRounds);
  }

  // Récupérer tous les clients
  findAll() {
    return this.clientRepository.findAndCount(); // Retourne une liste paginée
  }

  // Récupérer un client par ID
  findOne(id: number) {
    return this.clientRepository.findOne({ where: { id } });
  }
  
  findByEmail(email: string) {
    return this.clientRepository.findOne({where:{email:email}})
  }
  // Mettre à jour un client
  async update(id: number, updateClientDto: UpdateClientDto) {

    // Précharger le client existant avec les nouvelles données
    const client = await this.clientRepository.preload({
      id:+id,
      ...updateClientDto,
    });

    // Si un mot de passe est fourni, hacher le mot de passe
  

    return this.clientRepository.save(client); // Sauvegarde les modifications
  }

  async remove(id: number): Promise<void> {
    // Approche 1: Suppression manuelle (plus sûre)
    await this.commentRepository.delete({ client: { id } });
    await this.reservationRepository.delete({ client: { id } });
    await this.clientRepository.delete(id);

    // OU Approche 2: Utilisation des transactions
    await this.clientRepository.manager.transaction(async (entityManager) => {
      await entityManager.delete(Commentaire, { client: { id } });
      await entityManager.delete(Reservation, { client: { id } });
      await entityManager.delete(Client, id);
    });
  }

  async removeMultiple(toDelete: number[]) {   

    let resultDelete: boolean = null
    let resultDisable: boolean = null
    const allIntegers = toDelete.every(item => Number.isInteger(item));
if (!allIntegers) {
    console.log('Invalid data in toDelete array');
    // Handle the error appropriately
    return;
}

    if (toDelete.length != 0) {
      if (await this.clientRepository.delete(toDelete)) {
        resultDelete = true
      } else
        resultDelete = false
        console.log("unitsResposity",this.clientRepository)
    }

  return true 
  }

    // New updatePassword method
    async updatePassword(email: string, newPassword: string): Promise<Client> {
      // Find the user by email
      const client = await this.findByEmail(email);
      if (!client) {
        throw new NotFoundException('User not found');
      }
      // Hash the new password
      client.password = await this.hashPassword(newPassword);
      // Save the updated user
      return this.clientRepository.save(client);
    }

    async getClientStatistics() {
      const registrationTrends = await this.clientRepository
        .createQueryBuilder('client')
        .select("DATE_TRUNC('month', client.created_at)", 'month')
        .addSelect('COUNT(client.id)', 'newClients')
        .groupBy("DATE_TRUNC('month', client.created_at)")
        .orderBy('month', 'DESC')
        .limit(12)
        .getRawMany();
    
      const activityMetrics = await this.clientRepository
        .createQueryBuilder('client')
        .leftJoin('client.reservations', 'reservation')
        .leftJoin('client.commentaires', 'comment')
        .select([
          'COUNT(DISTINCT client.id) as totalClients',
          'COUNT(DISTINCT reservation.id) as totalReservations',
          'COUNT(DISTINCT comment.id) as totalComments',
          'COUNT(DISTINCT reservation.id)::float / COUNT(DISTINCT client.id) as avgReservationsPerClient'
        ])
        .getRawOne();
    
      const topClients = await this.clientRepository
        .createQueryBuilder('client')
        .leftJoin('client.reservations', 'reservation')
        .select('client.id', 'clientId')
        .addSelect('client.firstName', 'clientName')
        .addSelect('COUNT(DISTINCT reservation.id)', 'reservationCount')
        .groupBy('client.id')
        .addGroupBy('client.firstName')
        .orderBy('reservationCount', 'DESC')
        .limit(10)
        .getRawMany();
    
      // ➕ Ajout du total général des clients
      const totalClients = await this.clientRepository.count();
    
      return {
        totalClients,               // ➕ total clients global
        registrationTrends,         // 📈 nombre de nouveaux clients par mois
        activityMetrics,            // 📊 activité globale (réservations, commentaires)
        topClients                  // 🏆 top clients
      };
    }
    
    async getClientDetailsWithActivity(clientId: number) {
      return this.clientRepository
        .createQueryBuilder('client')
        .leftJoin('client.reservations', 'reservation')
        .leftJoin('client.commentaires', 'comment')
        .where('client.id = :clientId', { clientId })
        .select([
          'client.id as clientId',
          'client.firstName as clientName',
          'COUNT(DISTINCT reservation.id) as totalReservations',
          'COUNT(DISTINCT comment.id) as totalComments',
          'MAX(reservation.createdAt) as lastReservationDate'
        ])
        .groupBy('client.id')
        .addGroupBy('client.firstName')
        .getRawOne();
    }

    async getTotalClients(): Promise<number> {
      const count = await this.clientRepository.count();
      return count;
    }
    
   
// Dans client.service.ts

async getClientRegistrationTrends() {
  return this.clientRepository
    .createQueryBuilder('client')
    .select([
      "TO_CHAR(client.created_at, 'YYYY-MM') as month",
      'COUNT(client.id) as newClients'
    ])
    .groupBy("TO_CHAR(client.created_at, 'YYYY-MM')")
    .orderBy('month', 'DESC')
    .limit(12)
    .getRawMany();
}
async getClientActivityMetrics() {
  const metrics = await this.clientRepository
    .createQueryBuilder('client')
    .leftJoin('client.reservations', 'reservation')
    .select([
      'COUNT(DISTINCT client.id) as totalClients',
      'COUNT(DISTINCT reservation.id) as totalReservations',
      // Correction: Utilisation de CAST et de la syntaxe PostgreSQL pour ROUND
      'ROUND(CAST(COUNT(DISTINCT reservation.id) AS DECIMAL) / NULLIF(COUNT(DISTINCT client.id), 0), 2) as avgReservationsPerClient'
    ])
    .getRawOne();

  // Ajout des statistiques mensuelles d'activité
  const monthlyActivity = await this.reservationRepository
    .createQueryBuilder('reservation')
    .select([
      "TO_CHAR(reservation.createdAt, 'YYYY-MM') as month",
      'COUNT(reservation.id) as reservation_count', // Correction: utilisation de underscore
      'COUNT(DISTINCT reservation.clientId) as active_clients' // Correction: utilisation de underscore
    ])
    .groupBy("TO_CHAR(reservation.createdAt, 'YYYY-MM')")
    .orderBy('month', 'DESC')
    .limit(12)
    .getRawMany();

  return {
    ...metrics,
    monthlyActivity
  };
}}