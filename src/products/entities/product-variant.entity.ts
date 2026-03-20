import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, any>;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product: Product;
}