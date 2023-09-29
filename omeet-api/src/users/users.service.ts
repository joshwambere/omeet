import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {GLOBAL_USER_EXISTS} from "../__shared/constants/messages.constants";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {
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

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
