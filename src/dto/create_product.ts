import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, Min, ValidateNested } from 'class-validator';
import { DeliveryOptionDTO } from './delivery_option';
import { PaymentOptionDTO } from './payment_option';

export class ProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price:number

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentOptionDTO)
  paymentOptions!:PaymentOptionDTO

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryOptionDTO)
  delivery!:DeliveryOptionDTO

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(5)
  inventory: number;

}
