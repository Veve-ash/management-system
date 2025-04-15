import { IsNotEmpty, IsOptional, IsString } from "class-validator";
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
    Password:string

    @IsOptional()
    role: Role

    
}
