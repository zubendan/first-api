import Elysia from "elysia";
import { configService } from "../config/config.service";
import { logger } from "~/src/logger";
import { apiController } from "./controllers/api.controller";
import { testResolver } from "./resolvers/test.resolver";

export const apiModule = new Elysia({ name: "api/module" })
	.state("config", configService)
	.onStart(({ store }) => {
		if (store.config.generateSchema) {
			logger.info("Only needed to generate schema; exiting process now");
			process.exit(0);
		}
	})
	.use(apiController)
	.use(testResolver);