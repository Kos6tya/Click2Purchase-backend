import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId?: string) {
    const { items, ...customerData } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let totalAmount = 0;
    const orderItemsToSave: OrderItem[] = [];

    for (const item of items) {
      const variant = await this.variantRepository.findOne({ where: { id: item.variantId } });

      if (!variant) {
        throw new NotFoundException(`Product variant with ID ${item.variantId} not found`);
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for variant ${variant.sku}. Available: ${variant.stock}`);
      }

      const itemTotal = Number(variant.price) * item.quantity;
      totalAmount += itemTotal;

      const orderItem = new OrderItem();
      orderItem.quantity = item.quantity;
      orderItem.priceAtPurchase = variant.price;
      orderItem.variant = variant;

      orderItemsToSave.push(orderItem);

      // variant.stock -= item.quantity;
      // await this.variantRepository.save(variant);
    }

    const order = this.orderRepository.create({
      ...customerData,
      totalAmount,
      items: orderItemsToSave,
      user: userId ? { id: userId } : undefined,
    });

    return this.orderRepository.save(order);
  }
}