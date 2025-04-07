import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { House } from 'src/house/entities/house.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('offre')
export class Offre {
    @PrimaryGeneratedColumn()
        id: number;
        @Column("text",{name:"title",nullable:true})
        title: string;
        @Column("text",{name:"description",nullable:true})
        description: string;
        @Column("text",{name:"location",nullable:true})
         location: string;
        @Column("text",{name:"type",nullable:true})
        type: string;
        @Column("text",{name:"tva",nullable:true})
        tva: number;
        @Column("text",{name:"priceHT",nullable:true})
        priceHT: number;
        @Column("text",{name:"priceTTC",nullable:true})
        priceTTC: number;
        @Column("text", { name: "availability", nullable: true })
        availability: string;
       @Column("time", { name: "time", nullable: true })
        time: string;
        @Column({ nullable: true })
        imageUrl: string;
        @Column("int",{name:"createdAt",nullable:true})
        created_at: Date;
        @Column("int",{name:"createdBy",nullable:true})
        created_by: number;
        @Column("date",{name:"updateAt",nullable:true})
        updated_at: Date;
        @Column("int",{name:"updateBy",nullable:true})
        updated_by: number; 
        @Column("date",{name:"deleted_at",nullable:true})
        deleted_at: Date;
        @Column("int",{name:"deleted_by",nullable:true})
        deleted_by: number;
        @Column("boolean",{name:"active",nullable:true})
        active: boolean;
        @OneToMany(() => Reservation, (reservation) => reservation.offre)
        reservations?: Reservation[]; 
         @OneToMany(() => Commentaire, (commentaire) => commentaire.OffreId,)
        commentaires: Commentaire[];
        @ManyToOne(() => House, (house) => house.offers, {
        onDelete: 'CASCADE' 
        })
        @JoinColumn({ name: 'houseId' })
        house: House;
        @BeforeInsert()
        setCreateUserId() {
            // Set created_by with the actual user ID from your auth system
            // this.created_by = user.id;
        }
        @OneToMany(() => Favorite, (favorite) => favorite.offreId)
        favorites: Favorite[];
        @BeforeUpdate()
        setUpdateUserId() {
            // Set updated_by with the actual user ID from your auth system
            // this.updated_by = user.id;
        }
    
}
