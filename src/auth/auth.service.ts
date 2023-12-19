import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/users/entities/user.entity";
import { UtilsService } from "src/utils/utils.service";
import { LoginInput } from "./dto/login-input";
import { RegisterInput } from "./dto/register-input";
import { JwtPayload } from "./types";

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
      throw new ConflictException("User already exists");
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

    await this.updateRefreshToken(user.id, refreshToken);

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
      throw new BadRequestException("User does not exist");
    }

    const doPasswordsMatch = await argon2.verify(
      user.password,
      loginInput.password,
    );

    if (!doPasswordsMatch) {
      throw new BadRequestException("Password is incorrect");
    }

    const { accessToken, refreshToken } = await this.createTokens({
      id: user.id,
    });

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.utils.exclude(user, "password") as User,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, refreshToken: true },
    });

    if (!user || !user.refreshToken)
      throw new BadRequestException("User does not exist");

    const doRefreshTokensMatch = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!doRefreshTokensMatch) throw new ForbiddenException("Forbidden");

    const { accessToken: at, refreshToken: rt } = await this.createTokens({
      id: user.id,
    });
    await this.updateRefreshToken(user.id, rt);

    return { accessToken: at, refreshToken: rt };
  }

  private async updateRefreshToken(userId: string, token: string) {
    const hashedToken = await argon2.hash(token);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  private async createTokens(payload: JwtPayload) {
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: "7d",
      secret: this.config.get("REFRESH_TOKEN_SECRET"),
    });

    return { accessToken, refreshToken };
  }
}
