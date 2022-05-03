import { IsBoolean, IsNotEmpty } from "class-validator";

export class DeliveryOptionDTO {
  
  @IsNotEmpty()
  @IsBoolean()
  courier: boolean;

  @IsNotEmpty()
  @IsBoolean()
  express: boolean;

  @IsNotEmpty()
  @IsBoolean()
  handover: boolean;
}
