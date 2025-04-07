import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(createReservationDto);
    // reservation.user = user; // Set the user who made the reservation
    // reservation.randonnee = randonnee; // Set the reserved hike

    return await this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find({
      relations: ['user', 'offer','notifications','offre'], 
    });
    return reservations;
  }

  async findOne(id: number): Promise<Reservation | undefined> {
    return await this.reservationRepository.findOne( { where:{id:id} ,relations: ['user', 'offer','notifications','offre'] });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    this.reservationRepository.merge(reservation, updateReservationDto); // Update properties
    return await this.reservationRepository.save(reservation);
  }

  async delete(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
