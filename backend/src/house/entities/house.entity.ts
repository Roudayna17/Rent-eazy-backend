import { Characteristic } from "src/characteristic/entities/characteristic.entity";
import { Equipement } from "src/equipement/entities/equipement.entity";
import { Lessor } from "src/lessor/entities/lessor.entity";
import { Offre } from "src/offre/entities/offre.entity";
import { Picture } from "src/pictures/entities/picture.entity";
import { User } from "src/user/entities/user.entity";
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("house")
export class House {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { name: "title", nullable: true })
    title: string;

    @Column("text", { name: "description", nullable: true })
    description: string;

    @Column("text", { name: "type", nullable: true })
    type: string;

    @Column("text", { name: "location", nullable: true })
    location: string;

    @Column("boolean", { name: "active", nullable: true, default: true })
    active: boolean;

    @Column("text", { name: "city", nullable: true })
    city: string;

    @Column("integer", { name: "poste_code", nullable: true })
    poste_code: number;

    @Column("text", { name: "image", nullable: true })
    image: string;

    @Column("double precision", { name: "price", nullable: true })
    price: number;
    @Column("double precision", { name: "latitude", nullable: true })
    latitude: number;

    @Column("double precision", { name: "longitude", nullable: true })
    longitude: number;

    @Column("timestamp", { name: "createdAt", nullable: true })
    created_at: Date;

    @Column("integer", { name: "createdBy", nullable: true })
    created_by: number;

    @Column("timestamp", { name: "updateAt", nullable: true })
    updated_at: Date;

    @Column("integer", { name: "updateBy", nullable: true })
    updated_by: number;

    @Column("timestamp", { name: "deleted_at", nullable: true })
    deleted_at: Date;

    @Column("integer", { name: "deleted_by", nullable: true })
    deleted_by: number;
    
    @ManyToMany(() => Equipement, (equipement) => equipement.houses, {
        cascade: true,
        eager: true // If you want them always loaded
    })
    @JoinTable()
    equipements: Equipement[];
    
    @ManyToMany(() => Characteristic, (characteristic) => characteristic.houses, {
        cascade: true,
        eager: true // Add eager loading if you always want to load characteristics
    })
    @JoinTable()
    characteristics: Characteristic[];


    @OneToMany(() => Picture, (picture) => picture.house, { 
        cascade: true,
        eager: true 
    })
    pictures: Picture[];

    @OneToOne(() => Offre, (offre) => offre.house, { cascade: true })
    @JoinColumn()
     offre: Offre;

    @ManyToOne(() => Lessor, (lessor) => lessor.houses)
    @JoinColumn({ name: 'lessorId' })
    lessor: Lessor;
  
    @ManyToOne(() => User, (user) => user.houses)
    @JoinColumn({ name: 'userId' })
    user: User;

    @BeforeInsert()
    datecreate(){
        this.created_at= new Date()
    }

}