import { Injectable } from '@nestjs/common';
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
        
      async removeMultiple(toDelete: number[]) {   
        console.log("toDelete",toDelete)
  
        let resultDelete: boolean = null
        let resultDisable: boolean = null
        const allIntegers = toDelete.every(item => Number.isInteger(item));
    if (!allIntegers) {
        return;
    }
    
        if (toDelete.length != 0) {
          if (await this.offreRepository.delete(toDelete)) {
            resultDelete = true
          } else
            resultDelete = false
        }
    
      return true 
      }
     
      
    }
    