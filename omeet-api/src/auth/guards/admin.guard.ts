import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {PrismaService} from "../../../prisma/prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma:PrismaService
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string>('role', [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user } = ctx.switchToHttp().getRequest();

        const query = await this.prisma.user.findFirst({
            where: {
                id: user.id
            }
        })

        return requiredRoles.includes(query.email);
    }
}
