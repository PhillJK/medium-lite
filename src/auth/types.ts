export type JwtPayload = {
  id: string;
  role: Role;
};

export type JwtPayloadWithRefreshToken = {
  refreshToken: string;
} & JwtPayload;

export enum Role {
  Admin = "admin",
  User = "user",
}
