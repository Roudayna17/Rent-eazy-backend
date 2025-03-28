import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private jwtService: JwtService
    ){}

  async create(createUserDto: CreateUserDto) {
  let user=this.userRepository.create(createUserDto)//create object 
  console.log("user",user.password)
  user.password= (await(await (this.hashPassword(user.password))).toString())// hash the password
    console.log('user password', user.password); // console.log
    return this.userRepository.save(user); // save on database
  }
  async hashPassword(password:string){
const saltOrRounds = 15;
const hash = (await (bcrypt.hash(password, saltOrRounds))).toString();
console.log("hash",hash)
return hash
}


  findAll() {
    return  this.userRepository.findAndCount()
  }

  findOne(idUser: number) {
    return  this.userRepository.findOne({where:{id:idUser}})
  }
 

  async update(idUser: number, updateUserDto: UpdateUserDto) {
    console.log("updateUserDto service", updateUserDto)
    let user= await this.userRepository.preload({
      id:+idUser,
      ...updateUserDto
    })

    return this.userRepository.save(user)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }
  async removeMultiple(toDelete: number[]) {   

    let resultDelete: boolean = null
    let resultDisable: boolean = null
    const allIntegers = toDelete.every(item => Number.isInteger(item));
if (!allIntegers) {
    return;
}
    if (toDelete.length != 0) {
      if (await this.userRepository.delete(toDelete)) {
        resultDelete = true
      } else{
        resultDelete = false

      }
    }
  return true 
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
}
}