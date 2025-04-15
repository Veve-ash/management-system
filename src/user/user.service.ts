import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Role } from './enum/user.role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ){}
  async signUp(payload: CreateUserDto){
    const{Email, Password}=payload //destucturing
    const user = await this.userRepo.findOneBy({Email})
    if(user){
      throw new BadRequestException('Email already exists!');
    }

     const saltRounds = 10;
     const hashedPassword = await bcrypt.hash(Password, saltRounds)
    
    const signUp = await this.userRepo.save({...payload, Password: hashedPassword,})
    //const signUp = await this.userRepo.save(payload)
    return{
      statusCode: 201,
      message:`"${Email} Your account Has been Created Successfully"`,
      access_token: await this.jwtService.signAsync(signUp),
      data: { Email },
    }
  }

    async signIn(createUserDto:CreateUserDto){
      const{Email, Password}=createUserDto
  
      const user = await this.userRepo.findOne({where:{Email}});
      if (!user) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, email: user.Email };
      
      const isPasswordValid = await bcrypt.compare(Password, user.Password);
      if(!isPasswordValid){
        throw new UnauthorizedException('Invalid Credentials');
       }
  
      
      return {
        statusCode: 200,
        message:"Login Successful!",
       access_token: await this.jwtService.signAsync(payload),
      };
    }
  


    async user (headers: any): Promise<any>{
      const authorizationHeader = headers.authorization;
      if(authorizationHeader){
        const token = authorizationHeader.replace('Bearer ', '');
        const secret = process.env.JWTsecret;
        try{
          const decoded = this.jwtService.verify(token);
          let id = decoded["id"];
          let user = await this.userRepo.findOneBy({id});
          return { id: id, name: user?.firstName, Email:user?.Email, lastname: user?.lastName, role:user?.role}
        }
        catch(error){
          throw new HttpException('invalid token', 401)
        }
      }
      else{
        throw new HttpException('invalid or missing bearer token', 401)
      }
    }


    async findEmail(Email:string){
      const userEmail =await this.userRepo.findOneBy({Email})
      if(!userEmail){
        throw new HttpException('email already exists!', 400)
      }
      return userEmail;
    }

  findAll(createUserDto: CreateUserDto) {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

   async update(id: string, role: Role) {
    const user = await this.userRepo.findOneBy({id})
    if (!user){
      throw new Error('user not found!')
    }
    user.role= role
    return this.userRepo.save(user)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

