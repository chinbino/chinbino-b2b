import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('block_types')
export class BlockType {
  @PrimaryColumn('varchar', { length: 50 })
  id: string;

  @Column('jsonb')
  schema: any;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
