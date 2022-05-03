import { IsNotEmpty, IsMongoId } from "class-validator"

export class ProductIdDTO {

  @IsNotEmpty()
  @IsMongoId()
  productId:string

}