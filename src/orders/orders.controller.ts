import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (Checkout)' })
  @ApiBearerAuth() 
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const userId = req.user?.id;
    return this.ordersService.create(createOrderDto, userId);
  }
}