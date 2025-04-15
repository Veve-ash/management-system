import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor( private userService: UserService, private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWTSECRET'),
            passReqToCallback:true,
        });
    }

    async validate(data: {Email}):Promise<User>{
        const {Email} = data;
        const user = await this.userService.findEmail(Email);
        if(!user){
            throw new UnauthorizedException('login to access endpoints')
        }
        return user;
    }
}