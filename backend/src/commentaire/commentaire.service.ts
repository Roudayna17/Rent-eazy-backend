// commentaire.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { Client } from 'src/client/entities/client.entity';
import { House } from 'src/house/entities/house.entity';
import { Offre } from 'src/offre/entities/offre.entity';

@Injectable()
export class CommentaireService {
  constructor(
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
  ) {}
async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {

  const commentaire = new Commentaire();
  commentaire.content = createCommentaireDto.content;
  commentaire.rating = createCommentaireDto.rating;

  commentaire.client = { id: createCommentaireDto.clientId } as Client;
  commentaire.house = { id: createCommentaireDto.houseId } as House;

  if (createCommentaireDto.offreId > 0) {
    commentaire.offre = { id: createCommentaireDto.offreId } as Offre;
  } else {
    console.warn('Aucun offreId valide fourni, offreId sera null');
  }

  return this.commentaireRepository.save(commentaire);
}


  async findAll(): Promise<Commentaire[]> {
    return await this.commentaireRepository.find({
      relations: ['client', 'offre','offre.house'],
    });
  }

  async findOne(id: number): Promise<Commentaire> {
    return await this.commentaireRepository.findOne({
      where: { id },
      relations: ['client', 'house', 'offre'],
    });
  }
  async findByHouseId(houseId: number): Promise<Commentaire[]> {
    return await this.commentaireRepository.find({
      where: { house: { id: houseId } },
      relations: ['client', 'offre', 'house'], 
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateCommentaireDto: UpdateCommentaireDto): Promise<Commentaire> {
    await this.commentaireRepository.update(id, updateCommentaireDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.commentaireRepository.delete(id);
  }

  async getAverageRating(houseId: number): Promise<number> {
    const result = await this.commentaireRepository
      .createQueryBuilder('commentaire')
      .select('AVG(commentaire.rating)', 'average')
      .where('commentaire.houseId = :houseId', { houseId })
      .getRawOne();

    return parseFloat(result.average) || 0;
  }
}