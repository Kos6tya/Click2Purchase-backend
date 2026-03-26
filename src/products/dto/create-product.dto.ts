import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CreateVariantDto {
  @ApiProperty() @IsString() @IsNotEmpty() sku: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty() @IsNumber() @Min(0) stock: number;
  @ApiProperty() @IsBoolean() isDefault: boolean;
  @ApiProperty({ required: false }) @IsOptional() attributes?: Record<string, any>;
}

class CreateImageDto {
  @ApiProperty() @IsString() @IsNotEmpty() url: string;
  @ApiProperty() @IsBoolean() isMain: boolean;
}

export class CreateProductDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() slug: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiProperty() @IsString() @IsNotEmpty() categoryId: string;

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];

  @ApiProperty({ type: [CreateImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images: CreateImageDto[];
}