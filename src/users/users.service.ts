import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user-input";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "src/auth/types";
import { hash } from "argon2";
import { User } from "./entities/user.entity";
import { GetUsersResponse } from "./dto/get-users-response";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    const doesUserExists = await this.prisma.user.findUnique({
      where: { email: createUserInput.email },
      select: {
        id: true,
      },
    });

    if (doesUserExists) throw new ConflictException("User already exists");

    const hashedPassword = await hash(createUserInput.password);

    const user = await this.prisma.user.create({
      data: {
        email: createUserInput.email,
        name: createUserInput.name,
        role: createUserInput.role as Role,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findUsers(page: number, limit: number): Promise<GetUsersResponse> {
    const totalCount = await this.prisma.user.count();
    const pages = Math.ceil(totalCount / limit);

    if (page > pages) {
      return {
        hasNextPage: false,
        nextPage: pages - 1,
        totalPages: pages,
        limit,
        totalNumberOfUsers: totalCount,
        users: [],
      };
    }

    const users = await this.prisma.user.findMany({
      skip: page * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      hasNextPage: page < pages - 1,
      nextPage: Math.min(pages - 1, page + 1),
      totalPages: pages,
      limit,
      totalNumberOfUsers: totalCount,
      users,
    };
  }

  async findOneUser(id: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
