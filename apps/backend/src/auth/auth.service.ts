import { Inject, Injectable } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";

import { compare } from 'bcrypt'
import { v4 as uuid } from "uuid";
import { createToken, generateTokens, hashToken, verifyToken } from "src/utils/token";
import UserService from "src/user/user.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import DatabaseService from "src/database/database.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Response } from "express";
import EmailService from "src/email/email.service";


@Injectable()
export default class AuthService {

  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private _addRefreshToken(userId: string, jti: string, token: string) {
    return this.databaseService.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashToken(token),
        userId,
      }
    })
  }

  private _softDeleteRefreshToken(refreshTokenId: string) {
    return this.databaseService.refreshToken.update({
      where: {
        id: refreshTokenId
      },
      data: {
        revoked: true,
        deletedAt: new Date()
      }
    })
  }

  async createSession(userId: string, createSessionOptions?: CreateSessionOptions) {
    const jti = uuid()
    const {
      accessToken,
      refreshToken,
    } = generateTokens(userId, jti, createSessionOptions)
    await this._addRefreshToken(userId, jti, refreshToken)
    return {
      accessToken,
      refreshToken,
    } as AuthSession
  }

  async register(registerUserDto: RegisterUserDto) {
    await this.userService.createUser({
      provider: "local",
      ...registerUserDto
    });
    this.emailService.send({
      to: registerUserDto.email,
      subject: 'Welcome',
      html: 'Welcome ' + registerUserDto.username + '!<br>Bienvenue sur ft_transcendence !<br><br>(pas envie de faire un truc jolie...)',
    })
    return this.login(registerUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    let user = loginUserDto.email
      ? await this.userService.findUserByEmail(loginUserDto.email)
      : await this.userService.findUserByUsername(loginUserDto.username!)

    if (!user || !user.password || !await compare(loginUserDto.password, user.password)) {
      throw new Error('Invalid credentials')
    }

    if (user.twoFactorEnabled) {
      return this.start2fa(user.id)
    }
    return this.createSession(user.id)
  }

  async start2fa(userId: string) {
    const user = await this.userService.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const secret = this.userService.generate2faSecret()
    this.emailService.send({
      to: user.email,
      subject: '2FA code',
      html: 'Your 2FA code is: <strong>' + secret + '</strong><br>It will expire in 5 minutes.<br><br>(pas envie de faire un truc jolie...)',
    })
    const secureSecret = createToken({ secret }, process.env.TWO_FACTOR_EXPIRES_IN || '5m')
    await this.databaseService.user.update({
      where: {
        id: userId
      },
      data: {
        twoFactorSecret: secureSecret
      }
    })
    return {
      message: 'A mail has been sent to your email address with a 2FA code.',
      userId
    }
  }

  async complete2fa(userId: string, secret: string) {
    const user = await this.userService.findUserById(userId)
    if (!user || !user.twoFactorEnabled) {
      throw new Error('User not found or 2FA not enabled')
    }
    if (!user.twoFactorSecret) {
      throw new Error('2FA cannot be completed')
    }
    const payload = verifyToken<{ secret: string }>(user.twoFactorSecret)
    if (!payload || !payload.secret) {
      throw new Error('Expired or invalid 2FA secret')
    }
    if (payload.secret !== secret) {
      throw new Error('Invalid 2FA code')
    }
    await this.databaseService.user.update({
      where: {
        id: userId
      },
      data: {
        twoFactorSecret: null
      }
    })
    return this.createSession(userId)
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('No refresh token provided')
    }

    const payload = verifyToken<{ id: string, jti: string }>(refreshToken)
    if (!payload || !payload.id) {
      throw new Error('Expired or invalid refresh token')
    }

    const refreshTokenInDatabase = await this.databaseService.refreshToken.findUnique({
      where: {
        id: payload.jti
      }
    })
    if (
      !refreshTokenInDatabase
      || refreshTokenInDatabase.hashedToken !== hashToken(refreshToken)
      || refreshTokenInDatabase.revoked
    ) {
      throw new Error('Invalid refresh token')
    }

    const user = await this.userService.findUserById(payload.id)
    if (!user) {
      throw new Error('User not found')
    }
    await this._softDeleteRefreshToken(payload.jti)
    return this.createSession(payload.id)
  }

  async logout(userId: string, token: string) {
    const user = await this.userService.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    await this.databaseService.refreshToken.updateMany({
      where: {
        userId
      },
      data: {
        revoked: true,
        deletedAt: new Date(),
      }
    })

    let oldUserBlackList = await this.cacheManager.get(userId + ":blacklist") as string[]
    let newUserBlackList = oldUserBlackList ? [...oldUserBlackList || []] : []
    let newToken = hashToken(token)
    if (!newUserBlackList.includes(newToken)) {
      newUserBlackList.push(newToken)
    }
    await this.cacheManager.set(userId + ":blacklist", newUserBlackList, 0)

    return {
      message: 'User signed out'
    }
  }
}