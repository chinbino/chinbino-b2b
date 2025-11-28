import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('bigint')
  id: number;

  @Column()
  filename: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column('bigint', { nullable: true })
  size: number;

  @Column()
  url: string;

  @Column('jsonb', { nullable: true })
  metadata: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
