import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';
import { Offre } from './entities/offre.entity';
import { Repository } from 'typeorm';
import { House } from 'src/house/entities/house.entity';

@Injectable()
export class OffreService {
  
  constructor(
    @InjectRepository(Offre)
    private readonly offreRepository: Repository<Offre>,
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
      ) {}
    
      async create(offreData: CreateOffreDto) {
        // Recherche de la maison
        const house = await this.houseRepository.findOne({
          where: { id: offreData.houseId },
          relations: ['pictures'], // On récupère aussi les images liées à la maison
        });
      
        if (!house) {
          throw new Error('House not found');
        }
      
        // Vérification si la maison a des images et sélection de la première image
        const imageUrl = house.pictures?.length > 0 ? house.pictures[0]?.url : null;
      
        const offre = this.offreRepository.create({
          ...offreData,
          imageUrl, // Image principale (si elle existe)
          house
        });
      
        return this.offreRepository.save(offre);
      }
      
    async findAll() {
      return this.offreRepository.find({ 
          relations: ['house', 'house.pictures','commentaires','reservations'] 
      });
  }
  
  async findOne(id: number) {
      return await this.offreRepository.findOne({ 
          where: { id },
          relations: ['house', 'house.pictures']
      });
  }
    
      async update(id: number, updateOffreDto: UpdateOffreDto) {
        const existingOffer = await this.offreRepository.findOne({ where: { id } });
        
        if (!existingOffer) {
          throw new Error('Offer not found');
        }
      
        // Merge changes
        const updatedOffer = this.offreRepository.merge(existingOffer, updateOffreDto);
        
        return this.offreRepository.save(updatedOffer);
      }
      
      delete(id: number) {
        this.offreRepository.delete(id)
      }
  
      // offre.service.ts
async removeMultiple(ids: number[]) {
  // Validation des IDs
  if (!ids || !Array.isArray(ids)) {
      throw new HttpException('La liste des IDs est invalide', HttpStatus.BAD_REQUEST);
  }

  if (ids.length === 0) {
      return {
          success: true,
          deletedCount: 0,
          message: "Aucune offre à supprimer"
      };
  }

  try {
      // Suppression directe (le check d'existence est géré par TypeORM)
      const deleteResult = await this.offreRepository.delete(ids);

      return {
          success: true,
          deletedCount: deleteResult.affected,
          message: `${deleteResult.affected} offre(s) supprimée(s) avec succès`
      };
  } catch (error) {
      console.error('Erreur suppression multiple:', error);
      
      // Gestion spécifique des erreurs TypeORM
      if (error.code === 'ER_NO_REFERENCED_ROW') {
          throw new HttpException(
              'Certaines offres n\'existent pas', 
              HttpStatus.NOT_FOUND
          );
      }

      throw new HttpException(
          `Erreur lors de la suppression: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
      );
  }
} async getOfferStatistics() {
        const priceStats = await this.offreRepository
            .createQueryBuilder('offre')
            .select([
                'AVG(offre.priceTTC) AS averagePrice',
                'MIN(offre.priceTTC) AS minPrice',
                'MAX(offre.priceTTC) AS maxPrice'
            ])
            .getRawOne();
    
        const offerTrends = await this.offreRepository
            .createQueryBuilder('offre')
            .select("DATE_TRUNC('month', offre.createdAt)", 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'DESC')
            .limit(12)
            .getRawMany();
    
        const activeHouses = await this.offreRepository
            .createQueryBuilder('offre')
            .leftJoin('offre.house', 'house')
            .select('house.id', 'houseId')
            .addSelect('COUNT(offre.id) as offerCount')
            .groupBy('house.id')
            .orderBy('offerCount', 'DESC')
            .limit(5)
            .getRawMany();
    
        const formattedActiveHouses = activeHouses.map(house => ({
            houseId: house.houseId,
            offerCount: house.offerCount
        }));
    
        // Nouvelle logique pour obtenir les nouvelles statistiques
        const totalOffers = await this.offreRepository.count();
        const lastOffer = await this.offreRepository
            .createQueryBuilder('offre')
            .orderBy('offre.createdAt', 'DESC')
            .getOne();
    
        const mostCommentedOffer = await this.offreRepository
            .createQueryBuilder('offre')
            .leftJoin('offre.commentaires', 'commentaire')
            .select('offre.id', 'offreId')
            .addSelect('COUNT(commentaire.id) as commentCount')
            .groupBy('offre.id')
            .orderBy('commentCount', 'DESC')
            .getRawOne();
    
        const mostReservedOffer = await this.offreRepository
            .createQueryBuilder('offre')
            .leftJoin('offre.reservations', 'reservation')
            .select('offre.id', 'offreId')
            .addSelect('COUNT(reservation.id) as reservationCount')
            .groupBy('offre.id')
            .orderBy('reservationCount', 'DESC')
            .getRawOne();
    
        return {
            priceStatistics: priceStats,
            monthlyTrends: offerTrends,
            topHouses: formattedActiveHouses,
            totalOffers: totalOffers,
            lastOffer: lastOffer,
            mostCommentedOffer: mostCommentedOffer,
            mostReservedOffer: mostReservedOffer
        };
    }
  
    async getOffersWithReservationCount() {
        return this.offreRepository
            .createQueryBuilder('offre')
            .leftJoin('offre.reservations', 'reservation')
            .select('offre.id', 'offreId')
            .addSelect('offre.title', 'title')
            .addSelect('COUNT(reservation.id)', 'reservationcount')
            .groupBy('offre.id')
            .addGroupBy('offre.title')
            .orderBy('reservationcount', 'DESC')
            .getRawMany();
    }

    async findByLessorId(lessorId: number) {
      return this.offreRepository.find({
          where: {
              house: {
                  lessor: { id: lessorId }
              }
          },
          relations: [
              'house', 
              'house.pictures',
              'house.lessor',
              'reservations',
              'commentaires'
          ],
          order: {
            created_at: 'DESC'
          }
      });
  }
    
    }
    