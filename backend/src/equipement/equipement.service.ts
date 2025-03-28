import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipement } from './entities/equipement.entity';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class EquipementService {
  constructor(
    @InjectRepository(Equipement)
    private readonly equipementRepository: Repository<Equipement>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createEquipementDto: CreateEquipementDto, file: Express.Multer.File) {
    // Upload de l'image sur Cloudinary
    const imageUrl = await this.cloudinaryService.uploadImage(file);

    // Créez l'équipement avec l'URL de l'image
    const equipement = this.equipementRepository.create({
      ...createEquipementDto,
      image: imageUrl, // Ajoutez l'URL de l'image
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.equipementRepository.save(equipement);
  }

  async findAll(): Promise<Equipement[]> {
    return this.equipementRepository.find(); // Cela doit récupérer tous les champs des équipements
  }
  

  async findOne(id: number) {
    const equipement = await this.equipementRepository.findOne({ where: { id } });
    if (!equipement) {
      throw new NotFoundException(`Équipement avec l'ID ${id} non trouvé`);
    }
    return equipement;
  }

  
  async update(
    id: number,
    updateEquipementDto: UpdateEquipementDto,
    file?: Express.Multer.File,
  ) {
    const equipement = await this.equipementRepository.findOne({ where: { id } });

    if (!equipement) {
      throw new NotFoundException(`Équipement avec l'ID ${id} non trouvé`);
    }

    // Si une nouvelle image est fournie, uploader sur Cloudinary
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      equipement.image = imageUrl; // Mettre à jour l'URL de l'image
    }

    // Mettre à jour les autres champs
    Object.assign(equipement, updateEquipementDto);
    equipement.updated_at = new Date();

    return await this.equipementRepository.save(equipement);
  }

  
  async remove(id: number) {
    const result = await this.equipementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Équipement avec l'ID ${id} non trouvé`);
    }
  }

 
  async removeMultiple(toDelete: number[]) {
    // Vérifie que tous les éléments du tableau sont des nombres valides
    const allIntegers = toDelete.every((item) => Number.isInteger(item));
    if (!allIntegers) {
      throw new Error('Les IDs fournis ne sont pas valides');
    }

    // Supprime les équipements
    const result = await this.equipementRepository.delete(toDelete);
    return result.affected > 0;
  }
}