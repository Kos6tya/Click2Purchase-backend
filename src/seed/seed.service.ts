import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async runSeed() {
    this.logger.log('Starting database seeding...');

    await this.productRepository.query('TRUNCATE TABLE products CASCADE;');
    await this.categoryRepository.query('TRUNCATE TABLE categories CASCADE;');

    const electronics = this.categoryRepository.create({ name: 'Electronics', slug: 'electronics' });
    await this.categoryRepository.save(electronics);

    const smartphones = this.categoryRepository.create({ name: 'Smartphones', slug: 'smartphones', parent: electronics });
    const laptops = this.categoryRepository.create({ name: 'Laptops', slug: 'laptops', parent: electronics });
    await this.categoryRepository.save([smartphones, laptops]);

    const productsToCreate = [
      {
        name: 'Apple iPhone 15 Pro',
        slug: 'apple-iphone-15-pro',
        description: 'The latest iPhone with titanium design and A17 Pro chip.',
        category: smartphones,
        images: [
          { url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800', isMain: true },
          { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800', isMain: false },
        ],
        variants: [
          { sku: 'IP15P-128-BLK', price: 999.00, stock: 50, isDefault: true, attributes: { color: 'Black Titanium', storage: '128GB' } },
          { sku: 'IP15P-256-BLK', price: 1099.00, stock: 30, isDefault: false, attributes: { color: 'Black Titanium', storage: '256GB' } },
          { sku: 'IP15P-256-NAT', price: 1099.00, stock: 15, isDefault: false, attributes: { color: 'Natural Titanium', storage: '256GB' } },
        ],
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Galaxy AI is here. Welcome to the era of mobile AI.',
        category: smartphones,
        images: [
          { url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=800', isMain: true },
        ],
        variants: [
          { sku: 'S24U-256-GRY', price: 1299.00, stock: 40, isDefault: true, attributes: { color: 'Titanium Gray', storage: '256GB' } },
        ],
      },
      {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Lean. Mean. M3 machine.',
        category: laptops,
        images: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800', isMain: true },
        ],
        variants: [
          { sku: 'MBA-M3-8-256-MID', price: 1099.00, stock: 20, isDefault: true, attributes: { color: 'Midnight', ram: '8GB', storage: '256GB' } },
          { sku: 'MBA-M3-16-512-MID', price: 1499.00, stock: 10, isDefault: false, attributes: { color: 'Midnight', ram: '16GB', storage: '512GB' } },
        ],
      }
    ];

    const products = this.productRepository.create(productsToCreate);
    await this.productRepository.save(products);

    this.logger.log('Seeding completed successfully!');
    return { message: 'Database successfully seeded with categories and products!' };
  }
}