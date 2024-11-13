import type { User } from "@prisma/client";
import { prisma } from "~/prisma/prisma.service";
import { comparePassword } from "~/utils/crypto";
import { logger } from "~/logger";
import { hashidService } from "~/encryption/hashid.service";
import { jwtService } from "./jwt.service";

export const authService = {
  /**
   * If the given email and password match a user, return that user.
   * Otherwise, return null.
   */
  validateUser: async (email: string, password: string): Promise<User | null> => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });

    if (!(await comparePassword(password, user.password as string))) {
      return null;
    }

    return user;
  },

  /**
   * Sign a JWT token for the user.
   */
  generateAccessToken: async (userId: number): Promise<string> => {
    logger.trace({ userId }, "generateAccessToken");

    return await jwtService.sign({ sub: hashidService.encode(userId), tokenType: "access" });
  },
};
