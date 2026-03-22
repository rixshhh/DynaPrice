import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PricePreviewDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  segment?: string;
}
