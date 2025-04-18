// src/reservation/entities/reservation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
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
      

    @Column('date', { name: 'createdat' , nullable: true})
    createdAt: Date;

    @Column({ default: false })
    status: boolean; 

    @Column({ default: false })
    isRead: boolean; 

    @Column({ nullable: true })
    decisionDate: Date; 

    @Column({ nullable: true })
    decisionMessage: string; 
  
    @Column({ default: false })
    isRejected: boolean;
    @Column("date",{name:"updateAt",nullable:true})
    updated_at: Date;
    @Column("date",{name:"deleted_at",nullable:true})
    deleted_at: Date;
     @BeforeInsert()
               DateCreateAT(){
                   this.createdAt= new Date()
               }
               @BeforeUpdate()
               DateUpdateAT(){
                   this.updated_at= new Date()
               }
               @BeforeRemove()
               DateDeleteAT(){
                   this.deleted_at= new Date()
               }
}