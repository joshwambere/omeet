import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateAuthDto, LoginAuthDto} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('/verify')
  verify(@Query("t") t:string ) {
    return this.authService.verify(t);
  }

  @Post('/login')
  findAll(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
