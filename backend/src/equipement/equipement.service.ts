import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipement.entity';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class EquipementService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipementRepository: Repository<Equipment>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createEquipementDto: CreateEquipementDto, file: Express.Multer.File) {
    // Upload de l'image sur Cloudinary
    const imageUrl = await this.cloudinaryService.uploadImage(file);

    // Créez l'équipement avec l'URL de l'image
    const Equipment = this.equipementRepository.create({
      ...createEquipementDto,
      image: imageUrl, // Ajoutez l'URL de l'image
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.equipementRepository.save(Equipment);
  }


  async findOne(id: number) {
    return await this.equipementRepository.findOne({ where: { id } });
  }
    
  async findAll() {
    return await this.equipementRepository.find();
  }
  async update(
    id: number,
    updateEquipementDto: UpdateEquipementDto,
    file?: Express.Multer.File,
  ) {
    const Equipment = await this.equipementRepository.findOne({ where: { id } });

    if (!Equipment) {
      throw new Error('equipement non trouvé');
    }

    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      Equipment.image = imageUrl; 
    }

    // Mettre à jour les autres champs
    Object.assign(Equipment, updateEquipementDto);
    Equipment.updated_at = new Date();

    return await this.equipementRepository.save(Equipment);
  }

  async remove(id: number) {
    return this.equipementRepository.delete(id);
  }

 
  async removeMultiple(toDelete: number[]) {
    const allIntegers = toDelete.every((item) => Number.isInteger(item));
    if (!allIntegers) {
      throw new Error('Les IDs fournis ne sont pas valides');
    }
  
    return this.equipementRepository.manager.transaction(async (transactionalEntityManager) => {
      // First delete from junction table
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from('house_equipment_equipment')
        .where('equipmentId IN (:...ids)', { ids: toDelete })
        .execute();
  
      // Then delete equipment
      const result = await transactionalEntityManager.delete(Equipment, toDelete);
      return result.affected > 0;
    });
  }
}