import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Content } from './content.entity';
import { User } from '../../users/entities/user.entity';

@Entity('content_revisions')
@Index('IDX_content_revisions_content_id', ['content'])
export class ContentRevision {
  
  // ✅ PRIMARY COLUMN ADDED
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @Column('jsonb')
  blocks: any[];

  @Column('jsonb', { nullable: true })
  seo: any;

  @Column('jsonb', { nullable: true })
  meta: {
    note?: string;
    status?: string;
  };

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
