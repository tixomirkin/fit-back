import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import {DrizzleAsyncProvider} from "../drizzle/drizzle.provider";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../drizzle/schema";
import {compare, genSalt, hash} from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../users/users.service";
import {usersTable} from "../drizzle/schema";
import {TokenPayload} from "./interface/tokenPayload.interface";
import {Response} from "express";

@Injectable()
export class AuthService {
    JWT_COOKIE_NAME='refreshToken'
    JWT_REFRESH_DAY = 7

    constructor(
                @Inject(DrizzleAsyncProvider)
                private db: NodePgDatabase<typeof schema>,
                private readonly usersService: UsersService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService
                ) {}

    // async getCookieWithJwtToken(userId: typeof usersTable.id | string) {
    //     const payload: TokenPayload = { userId };
    //     const token = await this.jwtService.signAsync(payload);
    //     return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    // }

    async getNewTokens(refreshToken: string) {
        const result: TokenPayload = await this.jwtService.verifyAsync(refreshToken);
        if (!result) throw new UnauthorizedException('Невалидный refresh токен');

        const user = await this.usersService.getByIdWithoutPass(result.userId);
        const tokens = await this.issueTokens(user.id);

        return {user, ...tokens}
    }

    async issueTokens(userId: typeof usersTable.id | string) {
        const payload: TokenPayload = { userId };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '6h'
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d'
        });

        return {accessToken, refreshToken};

    }

    // getCookieForLogOut() {
    //     return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    // }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.getByEmail(email);
        if (!user) throw new UnauthorizedException('Невалидный email');
        if (!user.passwordHash) throw new BadRequestException('Пароль не задан');
        if (!await compare(password, user.passwordHash)) throw new UnauthorizedException("Неверный пароль")

        return user;
    }

    addRefreshToken(res: Response, refreshToken: string) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.JWT_REFRESH_DAY)

        res.cookie(this.JWT_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            domain: this.configService.get('APPLICATION_DOMAIN'),
            expires: expiresIn,
            secure: true,
            sameSite: 'none'
        });
    }

    removeRefreshTokenFromResponse(res: Response) {
        res.cookie(this.JWT_COOKIE_NAME, '', {
            httpOnly: true,
            domain: this.configService.get('APPLICATION_DOMAIN'),
            expires: new Date(0),
            secure: true,
            sameSite: 'none'
        });
    }

    // async validateOAuthLogin(req: any) {
    //     const user = await this.usersService.getByEmail(req.user.email);
    //
    //     if (!user) {
    //         this.usersService.createUser()
    //     }
    // }
}
