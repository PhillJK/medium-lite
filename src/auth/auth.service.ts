import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterInput } from "./dto/register-input";
import { User } from "src/users/entities/user.entity";
import { LoginInput } from "./dto/login-input";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { UtilsService } from "src/utils/utils.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly utils: UtilsService,
  ) {}

  async registerUser(registerInput: RegisterInput) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
      select: { id: true },
    });

    if (userExists) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    }

    const hashedPassword = await argon2.hash(registerInput.password);

    const user = await this.prisma.user.create({
      data: {
        email: registerInput.email,
        name: registerInput.name,
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

    const { accessToken, refreshToken } = await this.createTokens({
      id: user.id,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user as User,
    };
  }

  async login(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) {
      throw new HttpException("User does not existd", HttpStatus.CONFLICT);
    }

    const isPasswordsMatch = await argon2.verify(
      user.password,
      loginInput.password,
    );

    if (!isPasswordsMatch) {
      throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);
    }

    const { accessToken, refreshToken } = await this.createTokens({
      id: user.id,
    });

    return {
      accessToken,
      refreshToken,
      user: this.utils.exclude(user, "password") as User,
    };
  }

  private async createTokens<T extends object>(payload: T) {
    const accessToken = this.jwt.sign(payload, {
      expiresIn: "10s",
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: "7d",
      secret: this.config.get("REFRESH_TOKEN_SECRET"),
    });

    return { accessToken, refreshToken };
  }
}
