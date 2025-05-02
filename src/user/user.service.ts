import { BadRequestException, HttpException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { Role } from './enum/user.role.enum';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ){}

  async signUp(createUserDto: CreateUserDto) {
    createUserDto.Email = createUserDto.Email.toLowerCase()
    const { Email, Password, ...rest } = createUserDto;
    const user = await this.userRepo.findOne({ where: { Email: Email } });
    if (user) {
     throw new HttpException('sorry user with this email already exist', 400)
    }
    const hashedPassword = await argon2.hash(Password);
   
    const userDetails = await this.userRepo.save({
     Email,
     Password: hashedPassword,
     ...rest
    })
    
    const Userpayload = { id: userDetails.id, email: userDetails.Email };
    return {
     statusCode: 201,
     message:`"${Email} Your account Has been Created Successfully"`,
     access_token: await this.jwtService.signAsync(Userpayload),
    };
   
    }
   
    async signIn(loginDto:LoginDto){
      const{Email, Password}=loginDto
  
      const user = await this.userRepo.createQueryBuilder("user").addSelect("user.Password").where("user.Email = :Email", {Email:loginDto.Email}).getOne()
      const users = await this.userRepo.findOne({where:{Email}});
      if (!user) {
        throw new HttpException('Sorry User not found!',400);
      }

      const isPasswordValid = await this.verifyPassword(Password, user.Password);
      if(isPasswordValid){
        throw new HttpException('Invalid Credentials', 400);
       }
  
      const payload = { sub: user.id, Email: user.Email };
      
      // res.cookie('isAuthenticated', payload,{
      //   httpOnly: true,
      //   maxAge: 1 * 60 * 60 * 1000
      // });
      
      return {
        statusCode: 200,
        message:"Login Successful!",
       access_token: await this.jwtService.signAsync(payload),

      };
    }
   
  //   async signIn(loginDto: LoginDto,  @Res() res: Response) {
  //   const { Email, Password } = loginDto;
  //   // const user = await this.userRepo.findOne({where:{email:email}  })
  //   const user = await this.userRepo.createQueryBuilder("user").addSelect("user.password").where("user.email = :email", {Email:loginDto.Email}).getOne()
  //   if (!user) {
  //  throw new HttpException('No email found', 400)
  //  }
  //  const checkedPassword = await this.verifyPassword(user.Password, Password);
  //  if (!checkedPassword) {
  //   throw new HttpException('sorry password not exist', 400)
  //  }
  //  const token = await this.jwtService.signAsync({
  //  email: user.Email,
  //   id: user.id
  //   });
   
  //   res.cookie('isAuthenticated', token, {
  //    httpOnly: true,
  //    maxAge: 1 * 60 * 60 * 1000
  //   });
  //   // delete user.password
  //   return res.send({
  //    success: true,
  // userToken: token
   
  //   })
  //  }
   
   async logout(@Req() req: Request, @Res() res: Response) {
   const clearCookie = res.clearCookie('isAuthenticated');
   
   const response = res.send(` user successfully logout`)
   
   return {
    clearCookie,
    response
    }
    }
   
   
   async findEmail(Email: string) {
    const mail = await this.userRepo.findOneByOrFail({ Email })
    if (!mail) {
     throw new UnauthorizedException()
    }
    return mail;
   }
   
   async findAll() {
    return await this.userRepo.find()
   }
   
   findOne(id: number) {
    return `This action returns a #${id} user`;
    }
   
    update(id: number, updateUserDto: UpdateUserDto) {
   return `This action updates a #${id} user`;
    }
   
    remove(id: number) {
    return `This action removes a #${id} user`;
    }
    async verifyPassword(hashedPassword: string, plainPassword: string,): Promise<boolean> {
    try {
    return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
     console.log(err.message)
     return false;
    }
    }
   
    async user(headers: any): Promise<any> {
     const authorizationHeader = headers.authorization;
     if (authorizationHeader) {
     const token = authorizationHeader.replace('Bearer ', '');
     const secret = process.env.JWTSECRET;
     
     try {
   const decoded = this.jwtService.verify(token);
   let id = decoded["id"];
   let user = await this.userRepo.findOneBy({ id });
   return { id: id,  Email: user?.Email, role: user?.role };
    } catch (error) {
     throw new UnauthorizedException('Invalid token');
    
    }} else 
     throw new UnauthorizedException('Invalid or missing Bearer token');
    
    }
  
  
 
   async Update(userId: string): Promise<User> {
     const user = await this.userRepo.findOneBy({ id: userId });
 
     if (!user) {
       throw new HttpException('User not found', 404);
     }
 
     user.role = Role.Admin;
     return this.userRepo.save(user);
   }










  
  // async signUp(payload: CreateUserDto){
  //   const{firstName, lastName, Email, Password}=payload //destucturing
  //   const user = await this.userRepo.findOneBy({Email})
  //   if(user){
  //     throw new BadRequestException('Email already exists!');
  //   }

  //    //const saltRounds = 10;
  //    const hashedPassword = await argon2.hash(Password)
    
  //   const signUp = await this.userRepo.save({...payload, Email, Password: hashedPassword,})
  //   const userPayload = { id: signUp.id, email: signUp.Email }
  //   return{
  //     statusCode: 201,
  //     message:`"${Email} Your account Has been Created Successfully"`,
  //     access_token: await this.jwtService.signAsync(userPayload),
  //     data: { Email },
  //   }
  // }

   
  

  //   async verifyPassword(hashedPassword: string, plainPassword: string,): Promise<boolean> {
  //     try {
  //       return await argon2.verify(hashedPassword, plainPassword);
  //     } catch (err) {
  //       console.log(err.message)
  //       return false;
  //     }
  //   }
  

  //   async user (headers: any): Promise<any>{
  //     const authorizationHeader = headers.authorization;
  //     if(authorizationHeader){
  //       const token = authorizationHeader.replace('Bearer ', '');
  //       const secret = process.env.JWTSECRET;
  //       try{
  //         const decoded = this.jwtService.verify(token);
  //         let id = decoded["id"];
  //         let user = await this.userRepo.findOneBy({id});
  //         return { id: id, name: user?.firstName, Email:user?.Email, lastname: user?.lastName, role:user?.role}
  //       }
  //       catch(error){
  //         throw new HttpException('invalid token', 401)
  //       }
  //     }
  //     else{
  //       throw new HttpException('invalid or missing bearer token', 401)
  //     }
  //   }


  //   async findEmail(Email:string){
  //     const userEmail =await this.userRepo.findOneBy({Email})
  //     if(!userEmail){
  //       throw new HttpException('email already exists!', 400)
  //     }
  //     return userEmail;
  //   }

  // async findAll() {
  //   return await this.userRepo.find();
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  //  async update(id: string): Promise<User> {
  //   const user = await this.userRepo.findOneBy({id})
  //   if (!user){
  //     throw new Error('user not found!')
  //   }
  //   user.role = Role.Admin
  //   return this.userRepo.save(user)
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

