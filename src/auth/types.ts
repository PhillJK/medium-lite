export type JwtPayload = {
  id: string;
};

export type JwtPayloadWithRefreshToken = {
  refreshToken: string;
} & JwtPayload;
