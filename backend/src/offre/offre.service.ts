import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';
import { Offre } from './entities/offre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffreService {
  
  constructor(
        @InjectRepository(Offre)
        private readonly offreRepository: Repository<Offre>,
      ) {}
    
      async create(offreData: CreateOffreDto) {
        let offre =  await this.offreRepository.create(offreData);
        console.log()
        return this.offreRepository.save(offre)  }
    
        async findAll() {
          try {
            return await this.offreRepository.find({ 
              relations: ['house'] // Include the house relation
            });
          } catch (error) {
            console.error('Error fetching offers:', error);
            throw new Error('Failed to fetch offers');
          }
        }
    
      async findOne(id: number){
        return await this.offreRepository.findOne({ where: { id } });
      }
    
      async update(id: number, updateOffreDto: UpdateOffreDto) {
        // First find the existing offer
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
    