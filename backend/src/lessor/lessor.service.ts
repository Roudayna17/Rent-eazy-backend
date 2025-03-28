import { Injectable } from '@nestjs/common';
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
}