import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { Commentaire } from './entities/commentaire.entity';


@Injectable()
export class CommentaireService {
  constructor(
    @InjectRepository(Commentaire)
    private commentaireRepository: Repository<Commentaire>,
  ) {}

  async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
        

    return this.commentaireRepository.save(createCommentaireDto);
  }

  async findAll(): Promise<Commentaire[]> {
    return this.commentaireRepository.find({relations:['clientId','OffreId']});
  }

  findOne(id: number) {
    return this.commentaireRepository.findOne({where:{id:id},relations:['clientId','OffreId']})

  }




}
