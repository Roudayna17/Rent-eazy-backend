import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './entities/client.entity'; // Import correct de l'entité
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, // Utilisation de l'entité Client
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

  // Supprimer un client
  remove(id: number) {
    return this.clientRepository.delete(id); // Suppression basée sur l'ID
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
}