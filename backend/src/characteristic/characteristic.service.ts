import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CharacteristicService {
  constructor(
    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCharacteristicDto: CreateCharacteristicDto, file: Express.Multer.File) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);

    const characteristic = await this.characteristicRepository.create({
      ...createCharacteristicDto,
      image: imageUrl, 
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.characteristicRepository.save(characteristic);
  }

  

  async findOne(id: number) {
    return await this.characteristicRepository.findOne({ where: { id } });
  }

  
  async findAll() {
    return await this.characteristicRepository.find();
  }
  

  async remove(id: number) {
    return this.characteristicRepository.delete(id);
  }
  async update(
    id: number,
    updateCharacteristicDto: UpdateCharacteristicDto,
    file?: Express.Multer.File, 
  ) {
    const characteristic = await this.characteristicRepository.findOne({ where: { id } });
  
    if (!characteristic) {
      throw new Error('caracteristique non trouvé');
    }
  
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      characteristic.image = imageUrl; 
    }
  
    Object.assign(characteristic, updateCharacteristicDto);
    characteristic.updated_at = new Date();
  
  
    return this.characteristicRepository.save(characteristic);
  }
  async removeMultiple(toDelete: number[]) {
    const allIntegers = toDelete.every((item) => Number.isInteger(item));
    if (!allIntegers) {
      throw new Error('Les IDs fournis ne sont pas valides');
    }
  
    return this.characteristicRepository.manager.transaction(async (transactionalEntityManager) => {
      // First delete from junction table
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from('house_characteristics_characteristic')
        .where('characteristicId IN (:...ids)', { ids: toDelete })
        .execute();
  
      // Then delete characteristics
      const result = await transactionalEntityManager.delete(Characteristic, toDelete);
      return result.affected > 0;
    });
  }
  
}
