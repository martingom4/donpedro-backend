import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';


@Controller('api/')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('promotions')
  getPromotions(){
    return this.promotionsService.getPromotions()
  }
}
