import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("adresse")

export class Adresse {
    @PrimaryGeneratedColumn()
    id: number;
    @Column("text",{name:"city",nullable:true})
    city: string;
    @Column("text",{name:"state",nullable:true})
    state: string;
    @Column("text",{name:"street",nullable:true})
    street: string;
    @Column("text",{name:"phone",nullable:true})
    phone:number;
    @Column("text",{name:"geoCode",nullable:true})
    geoCode:number;
    created_at: Date;
    @Column("date",{name:"createdAt",nullable:true})
    created_by: Date;
    @Column("date",{name:"createdBy",nullable:true})
    updated_at: Date;
    @Column("date",{name:"updateAt",nullable:true})
    updated_by: Date;
    @Column("date",{name:"updateBy",nullable:true})
    active: boolean;
    @Column("text",{name:" active",nullable:true})
    
    deleted_at: Date;



}
