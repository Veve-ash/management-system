import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/guard/role';
import { Role } from './enum/user.role.enum';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(@Body() createUserDto: CreateUserDto) {
    return this.userService.signIn(createUserDto);
  }

  // @Get()
  // @Roles(Role.Admin)
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  @UseGuards(RolesGuard, AuthGuard())
  @Roles(Role.User)
 findAll(@Body() createUserDto: CreateUserDto) {
  return this.userService.findAll(createUserDto);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch()
  @UseGuards(RolesGuard, AuthGuard())
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() role: Role) {
    return this.userService.update(id, role);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
