import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Asset } from './asset.entity';

export enum ContentType {
  ARTICLE = 'article',
  NEWS = 'news',
  LANDING = 'landing',
  LANDING_MARKET = 'landing_market',
  PRODUCT_SHOWCASE = 'product_showcase',
  FAQ_PAGE = 'faq_page',
  STATIC_PAGE = 'static_page',
  BLOCK_TEMPLATE = 'block_template',
  MICROCONTENT = 'microcontent'
}

export enum ContentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity('contents')
@Index('IDX_contents_slug', ['slug'])
@Index('IDX_contents_type_status', ['type', 'status'])
@Index('IDX_contents_published_at', ['publishedAt'])
export class Content {


  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column('jsonb')
  title: Record<string, string>; // { "fa": "...", "en": "..." }

  @Column({ unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT
  })
  status: ContentStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column('jsonb', { nullable: true })
  excerpt: Record<string, string>;

  @Column('jsonb', { nullable: true })
  categories: string[];

  @Column('jsonb', { nullable: true })
  tags: string[];

  @Column('jsonb', { nullable: true })
  locales: string[];

  @Column('jsonb', { nullable: true })
  seo: {
    metaTitle?: Record<string, string>;
    metaDescription?: Record<string, string>;
    canonical?: string;
    robots?: string;
    ogImageId?: number;
  };

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'main_image_id' })
  mainImage: Asset;

  @Column('jsonb')
  blocks: any[]; // آرایه‌ای از بلوک‌ها

  @Column('text', { nullable: true })
  renderedHtml: string;

  @Column('tsvector', { select: false, nullable: true })
  searchVector: string;
}
