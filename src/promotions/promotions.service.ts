import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPromotionDto } from './dto/getPromotion.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}
  async getPromotions(): Promise<GetPromotionDto[]> {
    const promos = await this.prisma.promotion.findMany({
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    // ahora lo que tengo que hacer es ajustar el precio con la promocion
       // Factor de descuento por promoción: 1 - (pct / 100)
    const promosWithDiscount = promos.map((p) => {
      const factor = new Decimal(1).minus(new Decimal(p.discountPct).dividedBy(100));
      return { ...p, _discountFactor: factor };
    });

    return promosWithDiscount.map((p) => ({
      id:          p.id,
      title:       p.title,
      discountPct: Number(p.discountPct),
      products:    p.products.map((pp) => ({
        id:         pp.product.id,
        name:       pp.product.name,
        description: pp.product.description ?? '',
        price:     Decimal(pp.product.price).times(p._discountFactor),
        imageUrl:   pp.product.imageUrl ?? '',
        stock:      pp.product.stock,
        isActive:   pp.product.isActive,
        categoryId: String(pp.product.categoryId),
      })),
    }));
  }
}
