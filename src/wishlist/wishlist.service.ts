import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getUserWishlist(userId: string) {
    const items = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.images', 'product.variants'],
      order: { createdAt: 'DESC' },
    });

    return items.map(item => item.product);
  }

  async toggleWishlistItem(userId: string, productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingItem) {
      await this.wishlistRepository.remove(existingItem);
      return { status: 'removed', productId };
    } else {
      const newItem = this.wishlistRepository.create({
        user: { id: userId },
        product: { id: productId },
      });
      await this.wishlistRepository.save(newItem);
      return { status: 'added', productId };
    }
  }
}