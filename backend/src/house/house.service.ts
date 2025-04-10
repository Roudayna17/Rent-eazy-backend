
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { House } from './entities/house.entity';
import { Repository } from 'typeorm';
import { Picture } from 'src/pictures/entities/picture.entity';
import { Characteristic } from 'src/characteristic/entities/characteristic.entity';
import { Equipment } from 'src/equipement/entities/equipement.entity';
import { Lessor } from 'src/lessor/entities/lessor.entity';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,
    @InjectRepository(Equipment)
    private readonly equipementRepository: Repository<Equipment>,
    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,
    @InjectRepository(Lessor)
    private readonly lessorRepository: Repository<Lessor>,

  ) {}
  async create(houseData: CreateHouseDto) {
    const lessor = await this.lessorRepository.findOne({
      where: { id: houseData.lessorId }
    });
  
    if (!lessor) {
      throw new NotFoundException(`Lessor with ID ${houseData.lessorId} not found`);
    }
  
  const house = this.houseRepository.create({
    ...houseData,
    lessor,
    Equipment: [],
    characteristics: [],
    pictures:[]
  });
house.status="review"
 console.log(" houseData",houseData)
    // Gérer les équipements
    if (houseData.Equipment?.length) {
        // Récupérer les équipements existants
        const equipments = await this.equipementRepository.findByIds(
            houseData.Equipment.map(e => e.equipementId)
        );
        
        // Assigner les équipements à la maison
        house.Equipment = equipments;
        
        // Créer l'objet quantities
        house.equipementsQuantities = {};
        houseData.Equipment.forEach(eq => {
            house.equipementsQuantities[eq.equipementId] = eq.quantite;
        });
    }

    // Gérer les caractéristiques (identique à votre code actuel)
    if (houseData.characteristics?.length) {
        const charIds = houseData.characteristics.map(c => c.characteristicId);
        house.characteristics = await this.characteristicRepository.findByIds(charIds);
        house.characteristicsQuantities = houseData.characteristics.reduce((acc, curr) => {
            acc[curr.characteristicId] = curr.quantite;
            return acc;
        }, {});
    }
     const savedHouse = await this.houseRepository.save(house);
    if (houseData.pictures?.length) {
        const pictures = houseData.pictures.map(pic => {
            const picture = new Picture();
            picture.url = typeof pic === 'string' ? pic : pic.url;
            if (typeof pic !== 'string' && pic.cloudinaryId) {
                picture.cloudinaryId = pic.cloudinaryId;
            }
            picture.house = savedHouse;
            return picture;
        });
        await this.pictureRepository.save(pictures);
    }

    return savedHouse
}
async findOne(id: number) {
  const house = await this.houseRepository.findOne({
    where: { id },
    relations: ['pictures', 'Equipment', 'characteristics', 'user', 'lessor'],
  });

  if (!house) {
    throw new NotFoundException(`House with ID ${id} not found`);
  }

  return {
    ...house,
    characteristics: house.characteristics?.map(char => ({
      characteristicId: char.id,
      quantite: house.characteristicsQuantities?.[char.id] || 0
    })) || [],
    Equipment: house.Equipment?.map(equip => ({
      equipementId: equip.id,
      quantite: house.equipementsQuantities?.[equip.id] || 0
    })) || []
  };
}
async findAll() {
  const houses = await this.houseRepository.find({
    where: { active: true },
    relations: ['pictures', 'Equipment', 'characteristics', 'user', 'lessor'],
  });

  return houses.map(house => ({
    ...house,
    characteristics: house.characteristics?.map(char => ({
      characteristicId: char.id,
      quantite: house.characteristicsQuantities?.[char.id] || 0
    })) || [],
    Equipment: house.Equipment?.map(equip => ({
      equipementId: equip.id,
      quantite: house.equipementsQuantities?.[equip.id] || 0
    })) || []
  }));
}


async update(id: number, updateHouseDto: UpdateHouseDto, lessorId?: number){
  const house = await this.houseRepository.findOne({
    where: { id, lessor: { id: lessorId } },
    relations: ['Equipment', 'characteristics','pictures'],
});

if (!house) {
    throw new NotFoundException(`House with ID ${id} not found or you don't have permission`);
}

  this.houseRepository.merge(house, {
    ...updateHouseDto,
    Equipment: [],
    characteristics: [],
    pictures:[]
  });

  if (updateHouseDto.Equipment) {
    const equipIds = updateHouseDto.Equipment.map(e => e.equipementId);
    house.Equipment = await this.equipementRepository.findByIds(equipIds);
    house.equipementsQuantities = updateHouseDto.Equipment.reduce((acc, curr) => {
      acc[curr.equipementId] = curr.quantite;
      return acc;
    }, {});
  }
  if (updateHouseDto.pictures?.length) {
    // Supprimer les anciennes photos si tu veux les remplacer :
    await this.pictureRepository.delete({ house: { id } });
  
    const newPictures = updateHouseDto.pictures.map(pic => {
      const picture = new Picture();
      picture.url = typeof pic === 'string' ? pic : pic.url;
      if (typeof pic !== 'string' && pic.cloudinaryId) {
        picture.cloudinaryId = pic.cloudinaryId;
      }
      picture.house = house;
      return picture;
    });
  
    await this.pictureRepository.save(newPictures);
  }
  

  if (updateHouseDto.characteristics) {
    const charIds = updateHouseDto.characteristics.map(c => c.characteristicId);
    house.characteristics = await this.characteristicRepository.findByIds(charIds);
    house.characteristicsQuantities = updateHouseDto.characteristics.reduce((acc, curr) => {
      acc[curr.characteristicId] = curr.quantite;
      return acc;
    }, {});
  }

  await this.houseRepository.save(house);
  return this.findOne(id);
}

async delete(id: number, lessorId?: number): Promise<{ message: string }> {
  // Vérifier d'abord si le logement existe et appartient au lessor
  const house = await this.houseRepository.findOne({
      where: { id, lessor: { id: lessorId } },
      relations: ['pictures'],
  });

  if (!house) {
      throw new NotFoundException(`House with ID ${id} not found or you don't have permission`);
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
  async findByLessorId(lessorId: number) {
    return this.houseRepository.find({
        where: { lessor: { id: lessorId } },
        relations: ['pictures', 'Equipment', 'characteristics', 'lessor'],
    });
}
validationStatus(id:number,houseData:House){
  houseData.status="complete"
   let house= this.houseRepository.preload({
    id:+id,
  ...houseData  })
}


}