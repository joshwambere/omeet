import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {GLOBAL_USER_EXISTS} from "../__shared/constants/messages.constants";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private ConfigService: ConfigService) {
    }

    async create(createUserDto: CreateUserDto) {
        const {email, password, username} = createUserDto;
        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userExists) throw new BadRequestException(GLOBAL_USER_EXISTS);

        return this.prisma.user.create({
            data: {
                email,
                password,
                username
            }
        })
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async findOneByToken(token: string) {

        const id = await this.getUserIdFromToken(token);

        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) throw new BadRequestException('User not found');

        return {...user, password: undefined}
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
    async getUserIdFromToken(token: string) {
        const valid = this.jwtService.verify(token, {secret: this.ConfigService.get('JWT_SECRET')});

        if (!valid) throw new BadRequestException('Invalid token');

        const tokenData = this.jwtService.decode(token);
        return tokenData['id'];
    }
}
