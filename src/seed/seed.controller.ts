import { Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Database Seed (Dev Only)')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Populate database with fake products and categories' })
  @ApiHeader({
    name: 'x-seed-key',
    description: 'Secret key to authorize database seeding',
    required: true,
  })
  async seedDatabase(@Headers('x-seed-key') seedKey: string) {
    if (seedKey !== process.env.SEED_SECRET) {
      throw new UnauthorizedException('Invalid or missing seed key');
    }

    return this.seedService.runSeed();
  }
}