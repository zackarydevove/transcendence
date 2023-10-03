import { Body, Controller, Get, HttpException, HttpStatus, Query, Req, Res } from "@nestjs/common";
import FortyTwoService from "./fortytwo.service";
import AuthService from "src/auth/auth.service";
import { Response } from "express";
import TypedError from "src/errors/TypedError";
import { SocketService } from "src/socket/socket.service";

import { v4 as uuid } from 'uuid'

@Controller('42')
export default class FortyTwoController {

  constructor(
    private fortyTwoService: FortyTwoService,
    private authService: AuthService,
    private socketService: SocketService
  ) { }

  @Get('oauth')
  async oauth() {

    const uniqueId = uuid()

    return {
      url: this.fortyTwoService.createAuthorizationUrl(uniqueId),
      uniqueId,
    }
  }


  @Get('oauth/callback')
  async oauthCallback(
    @Req() req: Request,
    @Query() query: Record<string, any>,
    @Res() res: Response,
  ) {
    const { code, state } = query

    // @ts-ignore
    const redirectUrl = process.env.NEXT_PUBLIC_FRONT_URL || req.headers['referer'] as string || null
    if (!redirectUrl) {
      throw new Error("NEXT_PUBLIC_FRONT_URL is not defined, something is wrong with the environment variables.")
    }

    try {
      const token = await this.fortyTwoService.getToken(code, state)
      const user = await this.fortyTwoService.findOrCreateUser(token)
      const session = await this.authService.createSession(user.id)

      this.socketService.socket.emit('oauthComplete:' + state, {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        oauthToken: token.access_token
      })
    } catch (error) {
      console.log(error?.message || 'Something went wrong with the 42 oauth callback')
      this.socketService.socket.emit('oauthError:' + state)
    }

    return true
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