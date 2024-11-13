import Elysia, { t } from "elysia";

const signInResponseDto = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

const refreshAccessTokenResponseDto = t.Object({
  accessToken: t.String(),
});

export type SignInResponseDto = typeof signInResponseDto.static;
export type RefreshAccessTokenResponseDto = typeof refreshAccessTokenResponseDto.static;

export const AuthModel = new Elysia().model({
  signInResponseDto,
  refreshAccessTokenResponseDto,
});
