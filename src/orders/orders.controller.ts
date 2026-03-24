import { Controller, Post, Body, Get, UseGuards, Request, Headers, Req, type RawBodyRequest } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order (Checkout)' })
  @ApiBearerAuth()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const userId = req.user?.id;
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user order history' })
  findMyOrders(@Request() req) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe Webhook (Do not call manually from frontend)' })
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature || !req.rawBody) {
      return { error: 'Missing signature or body' };
    }
    return this.ordersService.handleStripeWebhook(signature, req.rawBody);
  }
}