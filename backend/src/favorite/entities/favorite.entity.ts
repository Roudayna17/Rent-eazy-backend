import { Offre } from 'src/offre/entities/offre.entity';
import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('favorite')
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Offre, (offre) => offre.favorites, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'offreId' })
    offreId: Offre;
    @ManyToOne(() => Client, (client) => client.favorites, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'clientId' })
    clientId: Client;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: true })
    active: boolean;
}