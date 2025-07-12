import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';




@Module({
  imports: [AuthModule, ProductsModule, OrdersModule, PrismaModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
