
import { Offre } from 'src/offre/entities/offre.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Notification } from 'src/notification/entities/notification.entity';
import { BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm'; 
import { Client } from 'src/client/entities/client.entity';
@Entity("Reservation")
export class Reservation {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
    @Column({ nullable: false })
    dateReservation: Date;
    @ManyToOne(() => Client, (client: Client) => client.id)
    @JoinColumn({ name: "clientId" })
    clientId: number | null;
    @Column("boolean", { name: "status", nullable: true })
    Status: boolean;
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
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
    @ManyToOne(() => Offre, (offre) => offre.reservations)
    offre?: Offre;
    @BeforeInsert()
    dateCreate(){
        this.created_at= new Date()
    }
    @BeforeUpdate()
    dateUpdate(){
        this.updated_at= new Date()
    }
}
