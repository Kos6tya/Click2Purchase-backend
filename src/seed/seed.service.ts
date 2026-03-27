import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    this.logger.log('Starting database seeding...');

    await this.userRepository.query('TRUNCATE TABLE users CASCADE;');
    await this.productRepository.query('TRUNCATE TABLE products CASCADE;');
    await this.categoryRepository.query('TRUNCATE TABLE categories CASCADE;');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = this.userRepository.create({
      email: 'admin@click2purchase.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(adminUser);

    const electronics = this.categoryRepository.create({ name: 'Electronics', slug: 'electronics' });
    await this.categoryRepository.save(electronics);

    const smartphones = this.categoryRepository.create({ name: 'Smartphones', slug: 'smartphones', parent: electronics });
    const laptops = this.categoryRepository.create({ name: 'Laptops', slug: 'laptops', parent: electronics });
    const audio = this.categoryRepository.create({ name: 'Audio', slug: 'audio', parent: electronics });
    const wearables = this.categoryRepository.create({ name: 'Wearables', slug: 'wearables', parent: electronics });
    await this.categoryRepository.save([smartphones, laptops, audio, wearables]);

    const productsToCreate = [
      {
        name: 'Apple iPhone 15 Pro Max',
        slug: 'apple-iphone-15-pro-max',
        description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip.',
        category: smartphones,
        images: [{ url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'IP15PM-256-NAT', price: 1199.00, stock: 45, isDefault: true, attributes: { color: 'Natural Titanium', storage: '256GB' } },
          { sku: 'IP15PM-512-NAT', price: 1399.00, stock: 20, isDefault: false, attributes: { color: 'Natural Titanium', storage: '512GB' } },
        ],
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Welcome to the era of mobile AI.',
        category: smartphones,
        images: [{ url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=800', isMain: true }],
        variants: [{ sku: 'S24U-512-GRY', price: 1299.00, stock: 30, isDefault: true, attributes: { color: 'Titanium Gray', storage: '512GB' } }],
      },
      {
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        description: 'The best of Google AI, designed around you.',
        category: smartphones,
        images: [{ url: 'https://images.unsplash.com/photo-1696426132049-36630f5ec88a?q=80&w=800', isMain: true }],
        variants: [{ sku: 'PXL8P-128-OBS', price: 999.00, stock: 15, isDefault: true, attributes: { color: 'Obsidian', storage: '128GB' } }],
      },
      
      {
        name: 'MacBook Pro 16" M3 Max',
        slug: 'macbook-pro-16-m3-max',
        description: 'Mind-blowing. Head-turning. The ultimate pro laptop.',
        category: laptops,
        images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800', isMain: true }],
        variants: [{ sku: 'MBP16-M3MAX-36', price: 3499.00, stock: 10, isDefault: true, attributes: { color: 'Space Black', ram: '36GB', storage: '1TB' } }],
      },
      {
        name: 'ASUS ROG Zephyrus G14',
        slug: 'asus-rog-zephyrus-g14',
        description: 'Ultra-slim gaming laptop with OLED display.',
        category: laptops,
        images: [{ url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800', isMain: true }],
        variants: [{ sku: 'ROG-G14-4070', price: 1599.00, stock: 25, isDefault: true, attributes: { color: 'Eclipse Gray', gpu: 'RTX 4070' } }],
      },

      {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise cancellation headphones.',
        category: audio,
        images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800', isMain: true }],
        variants: [{ sku: 'SNY-XM5-BLK', price: 398.00, stock: 100, isDefault: true, attributes: { color: 'Black' } }],
      },
      {
        name: 'Apple AirPods Pro (2nd Gen)',
        slug: 'apple-airpods-pro-2',
        description: 'Magic remastered with USB-C.',
        category: audio,
        images: [{ url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800', isMain: true }],
        variants: [{ sku: 'APP2-USBC', price: 249.00, stock: 200, isDefault: true, attributes: { color: 'White' } }],
      },
      {
        name: 'Marshall Stanmore III',
        slug: 'marshall-stanmore-3',
        description: 'Legendary sound in a classic design.',
        category: audio,
        images: [{ url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800', isMain: true }],
        variants: [{ sku: 'MAR-STAN3-BLK', price: 379.00, stock: 12, isDefault: true, attributes: { color: 'Black' } }],
      },

      {
        name: 'Apple Watch Ultra 2',
        slug: 'apple-watch-ultra-2',
        description: 'The most rugged and capable Apple Watch.',
        category: wearables,
        images: [{ url: 'https://images.unsplash.com/photo-1696446700622-c430a91605f1?q=80&w=800', isMain: true }],
        variants: [{ sku: 'AWU2-ALP-BLU', price: 799.00, stock: 35, isDefault: true, attributes: { band: 'Alpine Loop Blue' } }],
      },
      {
        name: 'Garmin Fenix 7X Pro',
        slug: 'garmin-fenix-7x-pro',
        description: 'Premium multisport GPS smartwatch with solar charging.',
        category: wearables,
        images: [{ url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800', isMain: true }],
        variants: [{ sku: 'GRM-F7X-SOL', price: 899.00, stock: 18, isDefault: true, attributes: { edition: 'Solar Sapphire' } }],
      }
    ];

    const products = this.productRepository.create(productsToCreate);
    await this.productRepository.save(products);

    this.logger.log('Seeding completed successfully!');
    return { message: 'Database populated with extended catalog!' };
  }
}