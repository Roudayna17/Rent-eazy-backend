import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessorDto } from './dto/create-lessor.dto';
import { UpdateLessorDto } from './dto/update-lessor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Lessor } from './entities/lessor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessorService {
   
   constructor(
     @InjectRepository(Lessor)
     private readonly lessorRepository:Repository<Lessor>
     ){}
 
   async create(createUserDto: CreateLessorDto) {
   let lessor=this.lessorRepository.create(createUserDto)//create object 
   console.log("lessor",lessor.password)
   lessor.password= await this.hashPassword(lessor.password);// hash the password
   console.log("lessor password",lessor.password)// console.log 
   return this.lessorRepository.save(lessor);// save on database
 
 
   }

  private async hashPassword(password:string) :Promise<string> {
 const saltOrRounds = 15;
    return bcrypt.hash(password, saltOrRounds);
 }
   findAll() {
     return  this.lessorRepository.findAndCount();
   }
 
   findOne(id: number) {
     return  this.lessorRepository.findOne({where:{id:id}})
   }
 
   async update(id: number, updateLessorDto: UpdateLessorDto) {
     console.log("updateLessorDto service", updateLessorDto)
     const lessor = await this.lessorRepository.preload({
       id:+id,
       ...updateLessorDto
     });
 
     return this.lessorRepository.save(lessor);
   }
 
   remove(id: number) {
     return this.lessorRepository.delete(id);
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
      if (await this.lessorRepository.delete(toDelete)) {
        resultDelete = true
      } else
        resultDelete = false
        console.log("unitsResposity",this.lessorRepository)
    }

  return true 
 }
 findByEmail(email: string) {
  return this.lessorRepository.findOne({where:{email:email}})
}
  async updatePassword(email: string, newPassword: string): Promise<Lessor> {
    // Find the user by email
    const lessor = await this.findByEmail(email);
    if (!lessor) {
      throw new NotFoundException('User not found');
    }
    lessor.password = await this.hashPassword(newPassword);
    return this.lessorRepository.save(lessor);
  }
  

  async getStatistics() {
    const totalLessors = await this.lessorRepository.count();
    const recentLessors = await this.lessorRepository
      .createQueryBuilder('lessor')
      .select([
        "DATE_TRUNC('month', lessor.created_at) as month",
        'COUNT(*) as newLessors'
      ])
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();
  
    return {
      totalLessors,
      recentLessors
    };
  }
  
 

  async getLessorGrowthStats() {
    return this.lessorRepository
      .createQueryBuilder('lessor')
      .select([
        "DATE_TRUNC('month', lessor.created_at) as month",
        'COUNT(*) as newLessors',
        'COUNT(DISTINCT house.id) as newProperties'
      ])
      .leftJoin('lessor.houses', 'house')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();
  }
  async getLessorSummaryStats() {
    const totalLessors = await this.lessorRepository.count();
  
    const topLessorByHouses = await this.lessorRepository
      .createQueryBuilder('lessor')
      .leftJoin('lessor.houses', 'house')
      .select([
        'lessor.id as lessorId',
        'lessor.firstName as lessorName',
        'COUNT(house.id) as houseCount'
      ])
      .groupBy('lessor.id')
      .addGroupBy('lessor.firstName')
      .orderBy('houseCount', 'DESC')
      .limit(1)
      .getRawOne();
  
    const topLessorByOffers = await this.lessorRepository
      .createQueryBuilder('lessor')
      .leftJoin('lessor.houses', 'house')
      .leftJoin('house.offers', 'offer')
      .select([
        'lessor.id as lessorId',
        'lessor.firstName as lessorName',
        'COUNT(offer.id) as offerCount'
      ])
      .groupBy('lessor.id')
      .addGroupBy('lessor.firstName')
      .orderBy('offerCount', 'DESC')
      .limit(1)
      .getRawOne();
  
    const lastLessorWithOffer = await this.lessorRepository
      .createQueryBuilder('lessor')
      .leftJoin('lessor.houses', 'house')
      .leftJoin('house.offers', 'offer')
      .where('offer.id IS NOT NULL')
      .orderBy('offer.created_at', 'DESC')
      .select([
        'lessor.id as lessorId',
        'lessor.firstName as lessorName',
        'offer.created_at as lastOfferDate'
      ])
      .limit(1)
      .getRawOne();
  
    return {
      totalLessors,
      topLessorByHouses,
      topLessorByOffers,
      lastLessorWithOffer,
    };
  }
  
}