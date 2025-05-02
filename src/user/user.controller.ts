import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/guard/role';
import { Role } from './enum/user.role.enum';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(@Body() loginDto: LoginDto) {
    return this.userService.signIn(loginDto);
  }

  // @Get()
  // @Roles(Role.Admin)
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  @UseGuards(RolesGuard, AuthGuard())
  @Roles(Role.Admin)
 findAll() {
  return this.userService.findAll();
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  //@UseGuards(RolesGuard, AuthGuard())
  //@Roles(Role.Admin)
  update(@Param('id') id: string) {
    return this.userService.Update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
