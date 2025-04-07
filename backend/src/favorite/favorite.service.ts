import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    // const { offreId, clientId } = createFavoriteDto;

    // Check if this favorite already exists
    const existingFavorite = await this.favoriteRepository.findOne({
      // where: { offreId, clientId },
    });

    if (existingFavorite) {
      if (!existingFavorite.active) {
        // If exists but inactive, reactivate it
        existingFavorite.active = true;
        return await this.favoriteRepository.save(existingFavorite);
      }
      return existingFavorite; // Already exists and active
    }

    // Create new favorite
    const favorite = this.favoriteRepository.create(createFavoriteDto);
    return await this.favoriteRepository.save(favorite);
  }

  async findAll(): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { active: true },
      relations: ['offre', 'client'],
    });
  }

  async findOne(id: number): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id, active: true },
      relations: ['offre', 'client'],
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    return favorite;
  }

  async findByClient(clientId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      // where: { clientId, active: true },
      relations: ['offre', 'client'],
    });
  }

  async findByOffre(offreId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      // where: { offreId, active: true },
      relations: ['offre', 'client'],
    });
  }

  async update(
    id: number,
    updateFavoriteDto: UpdateFavoriteDto,
  ): Promise<Favorite> {
    const favorite = await this.findOne(id);
    this.favoriteRepository.merge(favorite, updateFavoriteDto);
    return await this.favoriteRepository.save(favorite);
  }

  async remove(id: number): Promise<void> {
    // Soft delete
    const favorite = await this.findOne(id);
    favorite.active = false;
    await this.favoriteRepository.save(favorite);
  }

  async hardRemove(id: number): Promise<void> {
    // Hard delete
    await this.favoriteRepository.delete(id);
  }

  async isFavorite(offreId: number, clientId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      // where: { offreId:offreId, clientId:clientId, active: true },
    });
    return !!favorite;
  }

  async toggleFavorite(CreateFavoriteDto:CreateFavoriteDto): Promise<Favorite | null> {
    const existingFavorite = await this.favoriteRepository.findOne({
      // where: { offreId, clientId },
    });

    if (existingFavorite) {
      // Toggle active status
      existingFavorite.active = !existingFavorite.active;
      return await this.favoriteRepository.save(existingFavorite);
    }

    // Create new favorite if it doesn't exist
    const newFavorite = this.favoriteRepository.create()
    return await this.favoriteRepository.save(newFavorite);
  }
}