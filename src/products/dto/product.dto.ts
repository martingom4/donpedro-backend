import { Decimal } from "@prisma/client/runtime/library"

export class ProductResponseDto {
  id: number;
  name: string;
  description?: string;
  price: Decimal;
  imageUrl?: string;
  stock: number;
}
