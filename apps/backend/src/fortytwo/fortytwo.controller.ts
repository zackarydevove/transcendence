import { Body, Controller, Get, HttpException, HttpStatus, Query, Res } from "@nestjs/common";
import FortyTwoService from "./fortytwo.service";
import AuthService from "src/auth/auth.service";
import { Response } from "express";
import TypedError from "src/errors/TypedError";


@Controller('42')
export default class FortyTwoController {

  constructor(
    private fortyTwoService: FortyTwoService,
    private authService: AuthService,
  ) { }

  @Get('oauth')
  async oauth() {
    return {
      url: this.fortyTwoService.createAuthorizationUrl()
    }
  }


  @Get('oauth/callback')
  async oauthCallback(
    @Res() res: Response,
    @Query("code") code: string
  ) {
    try {
      const token = await this.fortyTwoService.getToken(code)
      const user = await this.fortyTwoService.findOrCreateUser(token)
      const session = await this.authService.createSession(user.id)


      this.authService.createAuthCookie(res, session, {
        oauthToken: token.access_token,
      })

      res.redirect("http://localhost:3000")
    } catch (error) {
      let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
      if (error instanceof TypedError) {
        if (error.type === '42_TOKEN_ERROR') {
          httpStatus = HttpStatus.BAD_REQUEST
        }
        if (error.type === '42_USER_ERROR') {
          httpStatus = HttpStatus.UNAUTHORIZED
        }
      }
      throw new HttpException(
        error.message,
        httpStatus,
      )
    }
  }

  @Get('me')
  async me(
    @Body('oauthToken') oauthToken: string
  ) {
    try {
      const fortyTwoUser = await this.fortyTwoService.me(
        oauthToken,
        5000
      )
      return fortyTwoUser
    } catch (e) {
      throw new HttpException(
        e.message,
        HttpStatus.FORBIDDEN
      )
    }
  }

}