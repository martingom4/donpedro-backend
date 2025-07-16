import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { ProductResponseDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma:PrismaService){}

    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.prisma.product.findMany({
            where: { // listar productos si estan activos y tienen stock
                isActive: true,
                stock: {
                    gt: 0 // gt es mayor que 0
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                price:true,
                imageUrl: true,
                stock:true,

            }
        })
        return products.map(product => ({
            ...product,
            description: product.description ?? undefined,
            imageUrl: product.imageUrl ?? undefined,
        }));
    }
}

