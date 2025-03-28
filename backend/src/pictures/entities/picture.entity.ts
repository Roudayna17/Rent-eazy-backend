

import { House } from "src/house/entities/house.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Picture {

 
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

 
  @Column("text", { name: "url", nullable: true })
  url: string ;

 
  @Column("text", { name: "cloudinaryid", nullable: true })
  cloudinaryId: string | null;

 
  @Column("boolean", { name: "defaults", nullable: true, default: false })
  defaults: boolean | null;

 
  @Column("timestamp with time zone", { name: "createdat", nullable: true })
  createdAt: Date | null;

 
  @Column("timestamp with time zone", { name: "updatedat", nullable: true })
  updatedAt: Date | null;

 
  @Column("text", { name: "createdby", nullable: true })
  createdBy: number | null;
 
 
  @Column("text", { name: "updatedby", nullable: true })
  updatedBy: number | null;

 
  @Column("boolean", { name: "active", nullable: true, default: true })
  active: boolean | null;

  @ManyToOne(() => House, (house) => house.pictures)
  @JoinColumn({ name: "houseId" })
  house: House; // Utilisez l'entité plutôt que juste l'ID
  isFeatured: boolean;

  @BeforeInsert()
  eventCreatedAt() {
    this.createdAt = new Date();
  }
  @BeforeUpdate()
  eventUpdatedAt() {
    this.updatedAt = new Date();
  }
  

}
