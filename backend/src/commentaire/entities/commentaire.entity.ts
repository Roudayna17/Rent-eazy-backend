import { Client } from 'src/client/entities/client.entity';
import { Offre } from 'src/offre/entities/offre.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
@Entity()
export class Commentaire {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true})
  content: string;
  @Column({ nullable: true})
  rating: number
  @ManyToOne(() => Offre, offre => offre.commentaires)
  @JoinColumn({ name: "OffreId" })
  OffreId: number ;
  @ManyToOne(() => Client, client => client.commentaires)
  @JoinColumn({ name: "clientId" })
  clientId: Client | null; 
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
      @BeforeInsert()
      dateCreate(){
      this.created_at= new Date()
      }
      @BeforeUpdate()
      dateUpdate(){
          this.updated_at= new Date()
      }
}