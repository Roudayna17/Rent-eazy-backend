// src/reservation/entities/reservation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Offre } from '../../offre/entities/offre.entity';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client, (client) => client.reservations)
    client: Client;

    @ManyToOne(() => Offre, offre => offre.reservations, {
        onDelete: 'CASCADE'
      })
      @JoinColumn({ name: 'offreId' })
      offre: Offre;
      

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    status: boolean; // false = en attente, true = acceptée

    @Column({ default: false })
    isRead: boolean; // si le client a vu la notification

    @Column({ nullable: true })
    decisionDate: Date; // quand le propriétaire a pris la décision

    @Column({ nullable: true })
    decisionMessage: string; // message optionnel du propriétaire
    
    @Column({ default: false })
    isRejected: boolean;
}