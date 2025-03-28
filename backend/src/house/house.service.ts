import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { House } from './entities/house.entity';
import { Repository } from 'typeorm';
import { Picture } from 'src/pictures/entities/picture.entity';
import { Equipement } from 'src/equipement/entities/equipement.entity';
import { Characteristic } from 'src/characteristic/entities/characteristic.entity';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,
    @InjectRepository(Equipement)
    private readonly equipementRepository: Repository<Equipement>,
    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,
  ) {}

  async create(houseData: CreateHouseDto) {
    // Créer la maison
    const house = this.houseRepository.create(houseData);
    
    // Gérer les équipements si fournis
    if (houseData.equipements && houseData.equipements.length > 0) {
      const equipements = await this.equipementRepository.findByIds(houseData.equipements.map(e => e.id));
      house.equipements = equipements;
    }

    // Gérer les caractéristiques si fournies
    if (houseData.characteristics && houseData.characteristics.length > 0) {
      const characteristics = await this.characteristicRepository.findByIds(
        houseData.characteristics.map(c => c.id),
      );
      house.characteristics = characteristics;
    }

    // Sauvegarder la maison
    const savedHouse = await this.houseRepository.save(house);
    // Sauvegarder les pictures
    if (houseData.pictures && houseData.pictures.length > 0) {
      const pictures = houseData.pictures.map(pictureData => {
        const picture = new Picture();
        if (typeof pictureData === 'string') {
          picture.url = pictureData;
        } else {
          picture.url = pictureData.url;
          if (pictureData.cloudinaryId) {
            picture.cloudinaryId = pictureData.cloudinaryId;
          }
        }
        picture.house = savedHouse;
        return picture;
      });
      await this.pictureRepository.save(pictures);
    }

    return this.houseRepository.findOne({
      where: { id: savedHouse.id },
      relations: [
        'pictures',
        'equipements',
        'characteristics',
        'user',
        'lessor',
      ],
    });
  }

  async findAll() {
    return this.houseRepository.find({
      where: { active: true },
      relations: [
        'user',
        'lessor',
        'offre',
        'pictures',
        'equipements',
        'characteristics',
      ],
    });
  }

  async findOne(id: number) {
    const house = await this.houseRepository.findOne({
      where: { id },
      relations: [
        'user',
        'lessor',
        'pictures',
        'equipements',
        'characteristics',
      ],
    });

    if (!house) {
      throw new NotFoundException(`House with ID ${id} not found`);
    }

    return house;
  }

  async update(id: number, updateHouseDto: UpdateHouseDto) {
    const house = await this.houseRepository.findOne({
      where: { id },
      relations: ['equipements', 'characteristics'],
    });

    if (!house) {
      throw new NotFoundException(`House with ID ${id} not found`);
    }

    // Mettre à jour les propriétés de base
    this.houseRepository.merge(house, updateHouseDto);

    // Mettre à jour les équipements si fournis
    if (updateHouseDto.equipements) {
      const equipements = await this.equipementRepository.findByIds(
        updateHouseDto.equipements.map(e => e.id),
      );
      house.equipements = equipements;
    }

    // Mettre à jour les caractéristiques si fournies
    if (updateHouseDto.characteristics) {
      const characteristics = await this.characteristicRepository.findByIds(
        updateHouseDto.characteristics.map(c => c.id),
      );
      house.characteristics = characteristics;
    }

    return this.houseRepository.save(house);
  }

  async delete(id: number): Promise<{ message: string }> {
    // Vérifier d'abord si le logement existe
    const house = await this.houseRepository.findOne({
      where: { id },
      relations: ['pictures'],
    });

    if (!house) {
      throw new NotFoundException(`House with ID ${id} not found`);
    }

    // Supprimer d'abord les pictures
    await this.pictureRepository.delete({ house: { id } });

    // Puis supprimer le logement (les relations many-to-many seront gérées automatiquement)
    await this.houseRepository.delete(id);

    return {
      message: `House with ID ${id} and all related data deleted successfully`,
    };
  }

  async removeMultiple(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new Error('No IDs provided');
    }

    if (!ids.every(id => Number.isInteger(id))) {
      throw new Error('Invalid ID format');
    }

    try {
      await this.houseRepository
        .createQueryBuilder()
        .update(House)
        .set({ active: false })
        .whereInIds(ids)
        .execute();

      return true;
    } catch (error) {
      throw new Error(`Failed to deactivate houses: ${error.message}`);
    }
  }
}