import Elysia from "elysia";
import { configService } from "~/src/config/config.service";

export const apiController = new Elysia({ name: "api/controller" })
  .state("config", configService)
  .get("/", ({ store }) => ({
    name: "API",
    gitSha1: store.config.gitSha1,
  }));
