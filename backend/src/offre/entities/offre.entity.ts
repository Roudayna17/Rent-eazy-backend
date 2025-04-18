import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { House } from 'src/house/entities/house.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, ManyToOne, OneToMany, BeforeRemove } from 'typeorm';

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
        @Column("decimal",{name:"tva",nullable:true})
        tva: number;
        @Column("decimal",{name:"priceHT",nullable:true})
        priceHT: number;
        @Column("decimal",{name:"priceTTC",nullable:true})
        priceTTC: number;
        @Column("text", { name: "availability", nullable: true })
        availability: string;
       @Column("time", { name: "time", nullable: true })
        time: string;
        @Column({ nullable: true })
        imageUrl: string;
        @Column("timestamp", { name: "createdAt", nullable: true })
         created_at: Date;
         @Column("timestamp", { name: "createdBy", nullable: true })
         created_by: Date;        
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
        @OneToMany(() => Commentaire, commentaire => commentaire.offre)
        commentaires: Commentaire[];
        @ManyToOne(() => House, (house) => house.offers, {
        onDelete: 'CASCADE' 
        })
        @JoinColumn({ name: 'houseId' })
        house: House;
        @BeforeInsert()
           DateCreateAT(){
               this.created_at= new Date()// date de systeme
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
