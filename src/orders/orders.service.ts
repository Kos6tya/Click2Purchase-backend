import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(ProductVariant) private variantRepository: Repository<ProductVariant>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async create(createOrderDto: CreateOrderDto, userId?: string) {
    const { items, ...customerData } = createOrderDto;

    if (!items || items.length === 0) throw new BadRequestException('Order is empty');

    let totalAmount = 0;
    const orderItemsToSave: OrderItem[] = [];
    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const variant = await this.variantRepository.findOne({
        where: { id: item.variantId },
        relations: ['product']
      });

      if (!variant) throw new NotFoundException('Variant not found');
      if (variant.stock < item.quantity) throw new BadRequestException('Not enough stock');

      totalAmount += Number(variant.price) * item.quantity;

      const orderItem = new OrderItem();
      orderItem.quantity = item.quantity;
      orderItem.priceAtPurchase = variant.price;
      orderItem.variant = variant;
      orderItemsToSave.push(orderItem);

      stripeLineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${variant.product.name} (${variant.sku})`,
          },
          unit_amount: Math.round(Number(variant.price) * 100),
        },
        quantity: item.quantity,
      });
    }

    const order = this.orderRepository.create({
      ...customerData,
      totalAmount,
      items: orderItemsToSave,
      user: userId ? { id: userId } : undefined,
    });

    const savedOrder = await this.orderRepository.save(order);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      customer_email: customerData.customerEmail,
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        orderId: savedOrder.id,
      },
    });

    savedOrder.stripeSessionId = session.id;
    await this.orderRepository.save(savedOrder);

    return { url: session.url };
  }

  async findMyOrders(userId: string) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (order) {
          order.status = OrderStatus.PAID; 
          await this.orderRepository.save(order);
          console.log(`Order ${orderId} successfully marked as PAID!`);
        }
      }
    }

    return { received: true };
  }

  async findAllOrders() {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.variant', 'items.variant.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}