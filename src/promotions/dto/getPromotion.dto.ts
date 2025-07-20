import {ProductResponseDto} from "../../products/dto/product.dto";

export class GetPromotionDto{
    id:number
    title:string
    discountPct:number
    products: ProductResponseDto[]
    }

