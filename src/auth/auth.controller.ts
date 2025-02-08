import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Response, Request} from "express";
import {LoginDto} from "./dto/login.dto";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {Auth} from "./auth.decorator";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Public} from "./guards/jwt-authentication.guard";

@ApiTags("Auth - Авторизация")
@Controller('auth')
export class AuthController {

    // TODO: Добавить подтверждение email
    // TODO: Добавить авторизацию через google и yandex
    // TODO: Добавить сброс пароля
    // TODO: Добавить поля при регистрации
    // TODO: Добавить 2FA

    constructor(private authService: AuthService,
                private usersService: UsersService
    ) {}


    @HttpCode(200)
    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Получение refresh токена по логину и паролю' })
    async logIn(@Body() userDto: LoginDto, @Res({passthrough: true}) response: Response) {
        const {passwordHash, ...user} = await this.authService.validateUser(userDto.email, userDto.password);

        const {refreshToken, accessToken} = await this.authService.issueTokens(user.id)

        this.authService.addRefreshToken(response, refreshToken)
        return {...user, accessToken};
    }

    @HttpCode(200)
    @Public()
    @Post('login/access-token')
    @ApiOperation({ summary: 'Получение access токена и обновление refresh токена' })
    async getAccessToken(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response
    ) {

        // console.log()

        const refreshTokenFromCookie = request.cookies[this.authService.JWT_COOKIE_NAME]
        if (!refreshTokenFromCookie) {
            this.authService.removeRefreshTokenFromResponse(response)
            throw new UnauthorizedException('Refresh токен не найден в куки файлах')
        }

        const {refreshToken, accessToken} = await this.authService.getNewTokens(refreshTokenFromCookie)

        this.authService.addRefreshToken(response, refreshToken)

        return {accessToken};
    }



    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Регистрация пользователя' })
    async create(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response
    ) {

        const user = await this.usersService.createUser(createUserDto.email, createUserDto.password);
        const {accessToken, refreshToken} = await this.authService.issueTokens(user.id)
        this.authService.addRefreshToken(response, refreshToken)

        return {...user, refreshToken}
    }


    @Auth()
    @HttpCode(200)
    @ApiOperation({ summary: 'Удаление refresh токена' })
    @Post('logout')
    logOut(@Res({ passthrough: true }) response: Response) {
        this.authService.removeRefreshTokenFromResponse(response)
        return true
    }

}
