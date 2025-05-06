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
    @IsStrongPassword()
    Password:string

    @IsOptional()
    role: Role

    
}
