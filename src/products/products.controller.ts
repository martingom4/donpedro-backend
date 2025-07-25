import { Controller, Get} from '@nestjs/common';

import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async getAllProducts() {
        return this.productsService.getAllProducts();
    }
}
