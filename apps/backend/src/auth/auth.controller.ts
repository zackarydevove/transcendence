import { Body, Controller, Get, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import AuthService from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { TwoFaCallbackDto } from "./dto/two-fa-callback.dto";

@UsePipes(new ValidationPipe({
  exceptionFactory(errors) {
    const messages = errors.map((error) => {
      return {
        property: error.property,
        messages: Object.values(error?.constraints || {})
      }
    })
    throw new HttpException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: messages,
    }, HttpStatus.UNPROCESSABLE_ENTITY)
  },
}))
@Controller('auth')
export default class AuthController {

  constructor(
    private authService: AuthService,
  ) { }

  @Get('hello')
  hello() {
    return {
      message: "Hello World!"
    };
  }

  @Post('signup')
  async signup(@Body() registerUserDto: RegisterUserDto) {
    try {
      return await this.authService.register(registerUserDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT)
    }
  }

  @Post('2fa/callback')
  async twoFactorCallback(@Body() twoFaCallbackDto: TwoFaCallbackDto) {
    try {
      const {
        secretCode,
        userId
      } = twoFaCallbackDto
      return await this.authService.complete2fa(userId, secretCode)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('signin')
  async signin(@Body() loginUser: LoginUserDto) {
    try {
      return await this.authService.login(loginUser);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      return await this.authService.refresh(refreshToken);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('signout')
  async singout(
    @Body('userId') userId: string,
    @Body('accessToken') accessToken: string,
  ) {
    try {
      return await this.authService.logout(userId, accessToken);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

}

