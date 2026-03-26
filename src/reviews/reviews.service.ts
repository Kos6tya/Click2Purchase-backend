import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { productId, rating, comment } = createReviewDto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = this.reviewRepository.create({
      rating,
      comment,
      user: { id: userId },
      product: { id: productId },
    });

    return this.reviewRepository.save(review);
  }

  async getProductReviews(productId: string) {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { product: { id: productId } },
      relations: ['user'], 
      order: { createdAt: 'DESC' }, 
    });

    const averageRating = total > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total 
      : 0;

    const cleanReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        email: review.user.email,
      }
    }));

    return {
      reviews: cleanReviews,
      total,
      averageRating: Number(averageRating.toFixed(1)),
    };
  }
}