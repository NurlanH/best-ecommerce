import { IsNotEmpty, IsMongoId, IsString, IsEnum, IsBoolean, IsOptional } from "class-validator"
import { DeliveryMethod, PaymentMethod, PaymentPeriod } from "src/enums"

export class BuyProductDTO {

  @IsNotEmpty()
  @IsMongoId()
  productId:string

  @IsNotEmpty()
  @IsString()
  address:string

  @IsNotEmpty()
  @IsEnum(DeliveryMethod)
  deliveryMethod:string

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod:string

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PaymentPeriod)
  paymentMonthPeriod:number

}