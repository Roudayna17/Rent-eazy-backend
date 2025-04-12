import { House } from "src/house/entities/house.entity";
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity("User")
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column("text",{name:"firstname",nullable:true})
    firstName: string;
    @Column("text",{name:"lastName",nullable:true})
    lastName: string;
    @Column("text",{name:"email",nullable:true})
    email: string;
    @Column("text",{name:"password",nullable:true})
    password: string;
    @Column("text",{name:"password confirme",nullable:true})
    password_confirme: string;
    @Column("text",{name:"role",nullable:true})
    role: string;
    @Column("text",{name:"saltround",nullable:true})
    saltround: number;
    @Column("text",{name:"adresse",nullable:true})
    adresse: string;
    @Column("boolean",{name:"active",nullable:true})
    active: boolean;
    @Column("text",{name:"city",nullable:true})
    city: string;
    @Column("text",{name:"state",nullable:true})
    state: string;
    @Column("text",{name:"codePostal",nullable:true})
    codePostal: number;
    @Column("text",{name:"telephone",nullable:true})
    telephone: number;
    @Column("date",{name:"createAt",nullable:true})
    created_at: Date;
    @Column("date",{name:"updateAt",nullable:true})
    updated_at: Date;
    @Column("date",{name:"deleteAt",nullable:true})
    deleted_at: Date;

    @OneToMany(() => House, (house) => house.user,)
    houses: House[];
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