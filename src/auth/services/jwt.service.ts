import jwt from "@elysiajs/jwt";
import { configService } from "~/config/config.service";

const JWT = jwt({
  name: "jwt",
  secret: configService.jwtSecret,
}).decorator.jwt;

export const jwtService = {
  sign: JWT.sign,
  decode: JWT.verify,
};
