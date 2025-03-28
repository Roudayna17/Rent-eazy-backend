import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) {}

    // Créer un nouveau contact
    async create(contactData: Partial<Contact>) {
        const newContact = this.contactRepository.create(contactData);
        return await this.contactRepository.save(newContact);
    }

    // Récupérer tous les contacts
    async findAll(){
        return await this.contactRepository.find();
    }

    // Récupérer un contact par ID
    async findOne(id: number){
        return await this.contactRepository.findOne({ where: { id } });
    }

    // Mettre à jour un contact
    async update(id: number,updateContactDto:UpdateContactDto) {
      let contact= await this.contactRepository.preload({
        id:+id,
        ...updateContactDto
      })
      return this.contactRepository.save(contact)
    }
    // Supprimer un contact
    async delete(id: number){
        await this.contactRepository.delete(id); 
    }

  
}
