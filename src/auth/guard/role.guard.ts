import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";
import { ForbiddenRoleException } from "../exception/role.exception";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector, private readonly userService: UserService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const roles = this.reflector.get<string[]>('roles', context.getHandler());
       if (!roles) return true;

       const request = context.switchToHttp().getRequest();

       if (request?.user){
        const headers = request.headers;
        const user = await this.userService.user(headers);

        if (!user || !roles.includes(user.role)){
            throw new ForbiddenRoleException(roles.join(' or '));
        }
        return true;
       }
       return false;
    }
}