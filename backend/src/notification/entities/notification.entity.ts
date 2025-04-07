import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import { Offre } from 'src/offre/entities/offre.entity';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'boolean', default: false })
    isRead: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Reservation, (reservation) => reservation.notifications)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;

    @Column({ type: 'varchar', length: 50, nullable: true })
    type: string;
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