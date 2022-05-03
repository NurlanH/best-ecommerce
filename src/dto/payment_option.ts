import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class PaymentOptionDTO {

  @IsNotEmpty()
  @IsBoolean()
  haveCash?:boolean

  @IsNotEmpty()
  @IsBoolean()
  haveCredit?:boolean
}