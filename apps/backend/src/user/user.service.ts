import { Injectable } from "@nestjs/common";
import DatabaseService from "src/database/database.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";
import { CreateUserDto } from "./dto/create-user";

@Injectable()
export default class UserService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  async findUserById(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id
      }
    })
    return user
  }

  async findUserByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email
      }
    })
    return user
  }

  async findUserByUsername(username: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        username
      }
    })
    return user
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.provider === "local") {
        return await this.databaseService.user.create({
          data: {
            email: createUserDto.email,
            password: await hash(createUserDto.password, 10),
            username: createUserDto.username
          }
        })
      } else if (createUserDto.provider === "42") {
        return await this.databaseService.user.create({
          data: {
            email: createUserDto.email,
            username: createUserDto.username
          }
        })
      } else {
        throw new Error("Invalid provider")
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error?.meta?.target || []) as string[]
          if (target.includes('email')) {
            throw new Error('Email already exists')
          }
          if (target.includes('username')) {
            throw new Error('Username already exists')
          }
        }
      }
      throw error
    }
  }

  async changeUserStatus(userId: string, status: "online" | "offline" | "ingame") {
	const user = await this.databaseService.user.findUnique({
        where: {
            id: userId
        }
    });

	if (!user)
		throw new Error('User not found');

	return this.databaseService.user.update({
        where: {
            id: userId
        },
        data: {
            status: status
        }
    });
}

}