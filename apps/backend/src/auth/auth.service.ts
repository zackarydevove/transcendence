import { Inject, Injectable } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";

import { compare } from 'bcrypt'
import { v4 as uuid } from "uuid";
import { generateTokens, hashToken, verifyToken } from "src/utils/token";
import UserService from "src/user/user.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import DatabaseService from "src/database/database.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Response } from "express";


@Injectable()
export default class AuthService {

  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
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
    return this.login(registerUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    let user = loginUserDto.email
      ? await this.userService.findUserByEmail(loginUserDto.email)
      : await this.userService.findUserByUsername(loginUserDto.username!)

    if (!user || !user.password || !await compare(loginUserDto.password, user.password)) {
      throw new Error('Invalid credentials')
    }
    return this.createSession(user.id)
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

  createAuthCookie(res: Response, session: AuthSession, metadata?: Record<string, any>) {
    // create cookie for the session return by the oauth callback 
    res.cookie(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY || 'session', JSON.stringify({
      ...session,
      ...(metadata || {})
    }), {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
  }
}