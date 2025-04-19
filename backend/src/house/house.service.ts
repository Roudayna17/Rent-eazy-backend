
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { House } from './entities/house.entity';
import { Repository } from 'typeorm';
import { Picture } from 'src/pictures/entities/picture.entity';
import { Characteristic } from 'src/characteristic/entities/characteristic.entity';
import { Equipment } from 'src/equipement/entities/equipement.entity';
import { Lessor } from 'src/lessor/entities/lessor.entity';
import { User } from 'src/user/entities/user.entity';

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
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,


  ) {}
  async create(houseData: CreateHouseDto) {
    // Validation
    if (!houseData.lessorId && !houseData.userId) {
        throw new BadRequestException('Either lessorId or userId must be provided');
    }

    let lessor: Lessor | null = null;
    let user: User | null = null;

    // Gestion pour app mobile (lessor)
    if (houseData.lessorId) {
        lessor = await this.lessorRepository.findOne({
            where: { id: houseData.lessorId }
        });
        if (!lessor) {
            throw new NotFoundException(`Lessor with ID ${houseData.lessorId} not found`);
        }
    }

    // Gestion pour site web (user)
    if (houseData.userId) {
        user = await this.UserRepository.findOne({
            where: { id: houseData.userId }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${houseData.userId} not found`);
        }
    }

    const house = this.houseRepository.create({
        ...houseData,
        lessor,
        user,
        Equipment: [],
        characteristics: [],
        pictures: [],
    });

    // Gestion des équipements
    if (houseData.Equipment?.length) {
        const equipments = await this.equipementRepository.findByIds(
            houseData.Equipment.map(e => e.equipementId)
        );
        house.Equipment = equipments;
        house.equipementsQuantities = {};
        houseData.Equipment.forEach(eq => {
            house.equipementsQuantities[eq.equipementId] = eq.quantite;
        });
    }

    // Gestion des caractéristiques
    if (houseData.characteristics?.length) {
        const charIds = houseData.characteristics.map(c => c.characteristicId);
        house.characteristics = await this.characteristicRepository.findByIds(charIds);
        house.characteristicsQuantities = houseData.characteristics.reduce((acc, curr) => {
            acc[curr.characteristicId] = curr.quantite;
            return acc;
        }, {});
    }

    const savedHouse = await this.houseRepository.save(house);

    // Gestion des images
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

    return savedHouse;
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
      // 1. First delete pictures
      await this.pictureRepository
        .createQueryBuilder()
        .delete()
        .where("houseId IN (:...ids)", { ids })
        .execute();
  
      // 2. Remove many-to-many relationships with characteristics
      await this.houseRepository
        .createQueryBuilder()
        .relation(House, 'characteristics')
        .of(ids)
        .remove([]); // Empty array removes all relations
  
      // 3. Remove many-to-many relationships with equipment
      await this.houseRepository
        .createQueryBuilder()
        .relation(House, 'Equipment')
        .of(ids)
        .remove([]);
  
      // 4. Now delete the houses
      await this.houseRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(ids)
        .execute();
  
      return true;
    } catch (error) {
      throw new Error(`Failed to delete houses: ${error.message}`);
    }
  }


  async findByLessorId(lessorId: number) {
    return this.houseRepository.find({
        where: { lessor: { id: lessorId } },
        relations: ['pictures', 'Equipment', 'characteristics', 'lessor'],
    });
}


async findByPriceRange(minPrice: number, maxPrice: number) {
  return this.houseRepository
      .createQueryBuilder('house')
      .where('house.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice })
      .andWhere('house.active = :active', { active: true })
      .leftJoinAndSelect('house.pictures', 'pictures')
      .getMany();
}

async getHousesCountByLessor(): Promise<any[]> {
  return this.houseRepository
      .createQueryBuilder('house')
      .leftJoin('house.lessor', 'lessor')
      .select('lessor.id', 'lessorId')
      .addSelect('lessor.firstname', 'lessorName')
      .addSelect('COUNT(house.id)', 'count')
      .groupBy('lessor.id')
      .addGroupBy('lessor.firstname')
      .getRawMany();
}
async getTotalHouseCount(): Promise<number> {
  return await this.houseRepository.count();
}


async findRecentHouses(limit: number = 5) {
  return this.houseRepository
      .createQueryBuilder('house')
      .where('house.active = :active', { active: true })
      .orderBy('house.createdAt', 'DESC')
      .take(limit)
      .leftJoinAndSelect('house.pictures', 'pictures')
      .getMany();
}

async getHouseTypeStatistics() {
  const typeDistribution = await this.houseRepository
      .createQueryBuilder('house')
      .select('house.type', 'houseType')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(house.price)', 'averagePrice')
      .groupBy('house.type')
      .getRawMany();

  const popularTypes = await this.houseRepository
      .createQueryBuilder('house')
      .leftJoin('house.offers', 'offer')
      .leftJoin('offer.reservations', 'reservation')
      .select('house.type', 'houseType')
      .addSelect('COUNT(DISTINCT reservation.id)', 'reservationCount')
      .groupBy('house.type')
      .orderBy('reservationCount', 'DESC')
      .getRawMany();

  // Average price by type and city
  const priceByLocationAndType = await this.houseRepository
      .createQueryBuilder('house')
      .select(['house.type', 'house.city'])
      .addSelect('AVG(house.price)', 'averagePrice')
      .addSelect('COUNT(*)', 'count')
      .groupBy('house.type')
      .addGroupBy('house.city')
      .having('COUNT(*) > 0')
      .getRawMany();

  return {
      typeDistribution,
      popularTypes,
      priceByLocationAndType
  };
}

async findByTypeAndPrice(type: string, maxPrice: number) {
  return this.houseRepository
      .createQueryBuilder('house')
      .where('house.type = :type', { type })
      .andWhere('house.price <= :maxPrice', { maxPrice })
      .andWhere('house.active = :active', { active: true })
      .leftJoinAndSelect('house.pictures', 'pictures')
      .orderBy('house.price', 'ASC')
      .getMany();
}
async getStatisticsByType(): Promise<any[]> {
  return this.houseRepository
    .createQueryBuilder('house')
    .select('house.type', 'type')
    .addSelect('COUNT(*)', 'count')
    .addSelect('AVG(house.price) as averagePrice')
    .addSelect('MIN(house.price) as minPrice')
    .addSelect('MAX(house.price) as maxPrice')
    .where('house.active = :active', { active: true })
    .groupBy('house.type')
    .getRawMany();
}

}