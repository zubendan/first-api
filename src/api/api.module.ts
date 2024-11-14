import Elysia from "elysia";
import { authResolver } from "~/auth/resolver";
import { configService } from "~/config/config.service";
import { logger } from "~/logger";
import { apiController } from "./controllers/api.controller";

export const apiModule = new Elysia({ name: "api/module" })
  .state("config", configService)
  .use(apiController)
  .use(authResolver)
  .onStart(({ store }) => {
    if (store.config.generateSchema) {
      logger.info("Only needed to generate schema; exiting process now");
      process.exit(0);
    }
  });
