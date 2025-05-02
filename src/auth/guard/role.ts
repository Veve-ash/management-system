import { SetMetadata } from "@nestjs/common";
import { Role } from "src/user/enum/user.role.enum";

export const Roles =(...roles:string[])=>SetMetadata('roles',roles);