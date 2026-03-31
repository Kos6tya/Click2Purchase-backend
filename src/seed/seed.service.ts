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
      },
      {
        name: 'OnePlus 12',
        slug: 'oneplus-12',
        description: 'Smooth beyond belief with Snapdragon 8 Gen 3 and Hasselblad Camera.',
        category: smartphones,
        images: [{ url: 'https://images.unsplash.com/photo-1706596489397-603158097d46?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'OP12-512-EMR', price: 899.00, stock: 40, isDefault: true, attributes: { color: 'Silky Black', storage: '512GB' } }
        ],
      },
      {
        name: 'Nothing Phone (2)',
        slug: 'nothing-phone-2',
        description: 'Come to the bright side. Unique Glyph Interface and Nothing OS.',
        category: smartphones,
        images: [{ url: 'https://images.unsplash.com/photo-1692271815344-93e1577d61fc?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'NTH-P2-256-WHT', price: 699.00, stock: 60, isDefault: true, attributes: { color: 'White', storage: '256GB' } },
          { sku: 'NTH-P2-256-GRY', price: 699.00, stock: 55, isDefault: false, attributes: { color: 'Dark Gray', storage: '256GB' } }
        ],
      },
      {
        name: 'MacBook Air 15" M3',
        slug: 'macbook-air-15-m3',
        description: 'Lean. Mean. M3 machine. The world’s best 15-inch laptop.',
        category: laptops,
        images: [{ url: 'https://images.unsplash.com/photo-1514056052883-d017fddd0426?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'MBA15-M3-16-512', price: 1499.00, stock: 80, isDefault: true, attributes: { color: 'Starlight', ram: '16GB', storage: '512GB' } },
          { sku: 'MBA15-M3-16-1TB', price: 1699.00, stock: 35, isDefault: false, attributes: { color: 'Midnight', ram: '16GB', storage: '1TB' } }
        ],
      },
      {
        name: 'Dell XPS 15',
        slug: 'dell-xps-15',
        description: 'A perfect balance of power and portability with a stunning OLED display.',
        category: laptops,
        images: [{ url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'XPS15-OLED-32', price: 1999.00, stock: 15, isDefault: true, attributes: { color: 'Platinum Silver', ram: '32GB', storage: '1TB' } }
        ],
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        slug: 'lenovo-thinkpad-x1-carbon-11',
        description: 'Ultralight, ultra-powerful business laptop built for professionals.',
        category: laptops,
        images: [{ url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'TP-X1-G11-16', price: 1650.00, stock: 50, isDefault: true, attributes: { color: 'Deep Black', ram: '16GB', storage: '512GB' } }
        ],
      },
      {
        name: 'Bose QuietComfort Ultra',
        slug: 'bose-quietcomfort-ultra',
        description: 'World-class spatial audio and noise cancellation.',
        category: audio,
        images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'BOSE-QCU-BLK', price: 429.00, stock: 45, isDefault: true, attributes: { color: 'Black' } },
          { sku: 'BOSE-QCU-WHT', price: 429.00, stock: 30, isDefault: false, attributes: { color: 'White Smoke' } }
        ],
      },
      {
        name: 'Sennheiser Momentum 4',
        slug: 'sennheiser-momentum-4',
        description: 'Audiophile-inspired sound and 60-hour battery life.',
        category: audio,
        images: [{ url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'SENN-M4-BLK', price: 349.00, stock: 25, isDefault: true, attributes: { color: 'Matte Black' } }
        ],
      },
      {
        name: 'JBL Flip 6',
        slug: 'jbl-flip-6',
        description: 'Portable waterproof speaker with bold JBL Original Pro Sound.',
        category: audio,
        images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'JBL-FLIP6-BLU', price: 129.00, stock: 150, isDefault: true, attributes: { color: 'Ocean Blue' } },
          { sku: 'JBL-FLIP6-RED', price: 129.00, stock: 120, isDefault: false, attributes: { color: 'Fiesta Red' } }
        ],
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic',
        slug: 'samsung-galaxy-watch-6-classic',
        description: 'The iconic rotating bezel is back, bigger and better.',
        category: wearables,
        images: [{ url: 'https://images.unsplash.com/photo-1620189507195-68309c04c4d0?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'GW6C-47-SLV', price: 399.00, stock: 60, isDefault: true, attributes: { size: '47mm', color: 'Silver' } }
        ],
      },
      {
        name: 'Oura Ring Gen3',
        slug: 'oura-ring-gen3',
        description: 'Revolutionary smart ring that tracks your sleep, activity, and readiness.',
        category: wearables,
        images: [{ url: 'https://images.unsplash.com/photo-1599643478524-fb66f5c53147?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'OURA-G3-HRG', price: 349.00, stock: 100, isDefault: true, attributes: { color: 'Heritage Silver', size: 'Size 10' } },
          { sku: 'OURA-G3-STE', price: 399.00, stock: 45, isDefault: false, attributes: { color: 'Stealth', size: 'Size 10' } }
        ],
      },
      {
        name: 'Whoop 4.0',
        slug: 'whoop-4-0',
        description: 'Personalized 24/7 fitness and health tracker without a screen.',
        category: wearables,
        images: [{ url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?q=80&w=800', isMain: true }],
        variants: [
          { sku: 'WHOOP-4-ONYX', price: 239.00, stock: 200, isDefault: true, attributes: { band: 'Onyx Black' } }
        ],
      }
    ];

    const products = this.productRepository.create(productsToCreate);
    await this.productRepository.save(products);

    this.logger.log('Seeding completed successfully!');
    return { message: 'Database populated with extended catalog!' };
  }
}