import cors from "@elysiajs/cors";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { swagger } from "@elysiajs/swagger";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Elysia, t } from "elysia";
import { apiModule } from "./api/api.module";
import { configService } from "./config/config.service";
import { logger } from "./logger";

(async () => {
	const app = new Elysia().state("config", configService);

	switch (configService.type) {
		case "api":
			app
				.use(cors())
				.use(
					opentelemetry({
						spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
					}),
				)
				.use(swagger())
				.use(apiModule);
			break;
		// case "scheduler":
		//   app;
		//   break;
		// case "worker":
		//   app;
		//   break;
		default:
			throw new Error(`Module not found: ${process.env.type}`);
	}

	let port: number;

	if (["api", "scheduler", "google", "hourly"].includes(configService.type)) {
		port = configService.port;

		// TODO: maybe let's just not use health controllers in dev
		if (
			configService.env === "development" &&
			process.env.type === "scheduler"
		) {
			port = 3002;
		}
	} else {
		port = configService.workerPort;
	}

	app.listen(port);

	logger.info(
		`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
	);
})();
