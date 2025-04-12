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
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    @InjectRepository(Offre)
    private readonly offreRepository: Repository<Offre>,

  ) {}

  async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    // Verify all referenced entities exist
    const [client, house, offre] = await Promise.all([
      this.clientRepository.findOne({ where: { id: createCommentaireDto.clientId } }),
      this.houseRepository.findOne({ where: { id: createCommentaireDto.houseId } }),
      this.offreRepository.findOne({ where: { id: createCommentaireDto.offreId } }),
    ]);
  
    if (!client || !house || !offre) {
      throw new Error('One or more referenced entities do not exist');
    }
  
    const commentaire = new Commentaire();
    commentaire.content = createCommentaireDto.content;
    commentaire.rating = createCommentaireDto.rating;
    commentaire.client = client;
    commentaire.house = house;
    commentaire.offre = offre;
  
    return this.commentaireRepository.save(commentaire);
  }

  async findAll(): Promise<Commentaire[]> {
    return await this.commentaireRepository.find({
      relations: ['client', 'offre', 'offre.house'],
    });
  }

  async findOne(id: number): Promise<Commentaire> {
    return await this.commentaireRepository.findOne({
      where: { id },
      relations: ['client', 'house', 'offre'],
    });
  }

  // Nouvelle méthode pour trouver par offre ID
  async findByOffreId(offreId: number): Promise<Commentaire[]> {
    return await this.commentaireRepository.find({
      where: { offre: { id: offreId } },
      relations: ['client', 'house', 'offre'],
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

  // Nouvelle méthode pour la moyenne par offre
  async getAverageRatingByOffre(offreId: number): Promise<number> {
    const result = await this.commentaireRepository
      .createQueryBuilder('commentaire')
      .select('AVG(commentaire.rating)', 'average')
      .where('commentaire.offreId = :offreId', { offreId })
      .getRawOne();

    return parseFloat(result.average) || 0;
  }
}