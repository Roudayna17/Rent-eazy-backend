// commentaire.entity.ts
import { Client } from 'src/client/entities/client.entity';
import { House } from 'src/house/entities/house.entity';
import { Offre } from 'src/offre/entities/offre.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Commentaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('int')
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Offre, offre => offre.commentaires, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'offreId' })
  offre: Offre;
  
  
    @ManyToOne(() => House, house => house.commentaires, {
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'houseId' })
    house: House;
    
  
    @ManyToOne(() => Client, client => client.commentaires)
    @JoinColumn({ name: 'clientId' })
    client: Client;
}