import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("contact")
export class Contact {
     @PrimaryGeneratedColumn()
    id: number;
    @Column("text",{name:"firstname",nullable:true})
    firstName: string;
    @Column("text",{name:"lastName",nullable:true})
    lastName: string;
    @Column("text",{name:"email",nullable:true})
    email: string;
    @Column("text",{name:"tel",nullable:true})
    tel: string;
    @Column("text",{name:"fax",nullable:true})
    fax: string;
    @Column("date",{name:"createAt",nullable:true})
    created_at: Date;
    @Column("date",{name:"updateAt",nullable:true})
    updated_at: Date;
    @Column("date",{name:"deleteAt",nullable:true})
    deleted_at: Date;
    @Column("date",{name:"createdBy",nullable:true})
    createdBy:Date;
    @Column("date",{name:"updatedBy",nullable:true})
    updatedBy:Date;
    @Column("date",{name:"active",nullable:true})
    active:boolean;
    
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
