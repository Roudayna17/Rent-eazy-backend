import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationController {
    constructor(private readonly service: ReservationService) {}

    @Post('create-reservations')
    async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
        return this.service.create(dto);
    }

    @Get() // Route de base pour récupérer toutes les réservations
    async findAll(): Promise<Reservation[]> {
        return this.service.findAll();
    }

    // reservation.controller.ts
     @Get('lessor/:lessorId')
     async findByLessor(@Param('lessorId', ParseIntPipe) lessorId: number): Promise<Reservation[]> {
     return this.service.findByLessor(lessorId);
     }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.delete(id);
    }

    // reservation.controller.ts
    @Patch(':id/accept')
    async accept(
        @Param('id', ParseIntPipe) id: number,
        @Body('message') message?: string
    ): Promise<Reservation> {
        return this.service.acceptReservation(id, message);
    }

    @Delete(':id/reject')  // Notez l'absence d'espace
    async reject(@Param('id') id: number) {
        return this.service.rejectReservation(id);
    }

// Dans votre controller
@Get('client/:clientId')
async getClientReservations(@Param('clientId', ParseIntPipe) clientId: number): Promise<Reservation[]> {
    return this.service.getClientReservations(clientId);
}

@Get('client/:clientId/unread-count')
async getUnreadCount(@Param('clientId', ParseIntPipe) clientId: number): Promise<number> {
    return this.service.getUnreadCount(clientId);
}

@Patch(':id/mark-as-read')
async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return this.service.markAsRead(id);
}
@Get('analytics/statistics')
    async getReservationStats() {
        return this.service.getReservationStatistics();
    }

    @Get('analytics/trends')
    async getReservationTrends() {
        return this.service.getReservationTrends();
    }

    @Get('analytics/lessor-performance')
    async getReservationsPerLessor() {
        return this.service.getReservationsPerLessor();
    }
   
    @Get('analytics/monthly/:lessorId')
    async getLessorMonthlyStats(
        @Param('lessorId', ParseIntPipe) lessorId: number
    ) {
       
        return this.service.getReservationStatistics();
    }
    @Get('recent-with-details')
async getRecentWithDetails(@Query('limit') limit: number = 5) {
    return this.service.getRecentReservationsWithDetails(limit);
}
}