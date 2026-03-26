import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  getUserWishlist(@Request() req) {
    return this.wishlistService.getUserWishlist(req.user.id);
  }

  @Post(':productId/toggle')
  @ApiOperation({ summary: 'Toggle product in wishlist (Add/Remove)' })
  toggleWishlistItem(@Param('productId') productId: string, @Request() req) {
    return this.wishlistService.toggleWishlistItem(req.user.id, productId);
  }
}