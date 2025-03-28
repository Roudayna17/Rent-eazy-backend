import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("client")
export class Client {
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
    @Column("text",{name:"saltround",nullable:true})
    saltround: number;
    @Column("text",{name:"adresse",nullable:true})
    adresse: string;
    @Column("text",{name:"city",nullable:true})
    city: string;
    @Column("boolean",{name:"active",nullable:true})
    active: boolean;
    @Column("text",{name:"state",nullable:true})
    state: string;
    @Column("text",{name:"codePostal",nullable:true})
    codePostal: string;
    @Column("text",{name:"telephone",nullable:true})
    telephone: string;
    @Column("text",{name:"created_at",nullable:true})
    created_at: Date;
    @Column("date",{name:"updateAt",nullable:true})
    updated_at: Date;
    @Column("date",{name:"deleteAt",nullable:true})
    deleted_at: Date;
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

