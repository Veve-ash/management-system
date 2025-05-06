import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "../enum/user.role.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName:string

    @IsNotEmpty()
    @IsString()
    lastName:string

    @IsNotEmpty()
    @IsString()
    Email:string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1 })
    Password:string

    @IsOptional()
    role: Role

    
}
