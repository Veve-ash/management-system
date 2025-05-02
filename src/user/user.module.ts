import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { RolesGuard } from 'src/auth/guard/role.guard';
dotenv.config()

@Module({
  imports:[TypeOrmModule.forFeature([User]),

 JwtModule.register({
  global:true,
  secret: process.env.JWTSECRET,
  signOptions: { expiresIn: '1h'},
}),
  PassportModule.register({
  defaultStrategy:'jwt',
  session:true
})
],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, RolesGuard],
  exports:[UserService, PassportModule, JwtStrategy, TypeOrmModule]
})
export class UserModule {}
