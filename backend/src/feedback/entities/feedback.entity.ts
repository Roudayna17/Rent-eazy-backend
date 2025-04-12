import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  type: string; // 'suggestion', 'problem' ou 'praise'

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}