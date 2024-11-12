import * as process from "node:process";
import type { Level } from "pino";
import { isDefined } from "~/src/utils/type-guards";

type NodeEnv = "production" | "development" | "test";

const TYPE = "TYPE";
const ENV = "ENV";
const ENV_REAL = "ENV_REAL";
const NODE_ENV = "NODE_ENV";
const LOG_LEVEL = "LOG_LEVEL";
const LOG_QUERIES = "LOG_QUERIES";
const PROFILE_JOBS = "PROFILE_JOBS";
const PORT = "PORT";
const WORKER_PORT = "WORKER_PORT";
const GIT_SHA1 = "GIT_SHA1";
const JWT_SECRET = "JWT_SECRET";
const SQIDS_ALPHABET = "SQIDS_ALPHABET";
const API_URL = "API_URL";
const DATABASE_URL = "DATABASE_URL";
const REDIS_HOST = "REDIS_HOST";
const REDIS_PORT = "REDIS_PORT";
const REDIS_PASSWORD = "REDIS_PASSWORD";
const REDIS_SSL = "REDIS_SSL";
const REDIS_RL_HOST = "REDIS_RL_HOST";
const REDIS_RL_PORT = "REDIS_RL_PORT";
const REDIS_RL_PASSWORD = "REDIS_RL_PASSWORD";
const REDIS_RL_SSL = "REDIS_RL_SSL";
const FRONT_END_URL = "FRONT_END_URL";
const EMAIL_VERIFY_TEMPLATE_ID = "EMAIL_VERIFY_TEMPLATE_ID";
const EMAIL_FORGOT_PASSWORD_TEMPLATE_ID = "EMAIL_FORGOT_PASSWORD_TEMPLATE_ID";
const EMAIL_NOTIFICATION_TEMPLATE_ID = "EMAIL_NOTIFICATION_TEMPLATE_ID";
const API_URL_POSTBACK = "API_URL_POSTBACK";
const GENERATE_SCHEMA = "GENERATE_SCHEMA";

class ConfigService {
  public readonly type: "api" | "worker" | "scheduler" | "job-watcher" | "google" | "stats-aggregator";

  /**
   * Why both ENV and NODE_ENV?
   * NODE_ENV must be "production" in the staging environment, because the staging environment
   * must be prod-like, and many packages use this variable.
   * However, for certain processes of our own (such as seeding), we need to know if we're in
   * the staging environment or true production.
   */
  public readonly env: string;
  public readonly envReal: string;

  public readonly nodeEnv: NodeEnv;

  /**
   * The log level, application-wide.
   */
  public readonly logLevel: Level;

  public readonly logQueries: boolean;

  public readonly profileJobs: boolean;

  /**
   * The port that the web server will listen on.
   */
  public readonly port: number;

  /**
   * The port that the worker health check will listen on.
   */
  public readonly workerPort: number;

  /**
   * The git hash of the build being served (set in Docker build)
   */
  public readonly gitSha1: string;

  public readonly jwtSecret: string;

  public readonly squidsAlphabet: string;

  public readonly apiUrl: string;

  public readonly databaseUrl: string;

  public readonly redisHost: string;

  public readonly redisPort: number;

  public readonly redisPassword: string;

  public readonly redisSsl: boolean;

  public readonly redisRlHost: string;

  public readonly redisRlPort: number;

  public readonly redisRlPassword: string;

  public readonly redisRlSsl: boolean;

  public readonly frontEndUrl: string;

  public readonly emailVerifyTemplateId: string;
  public readonly emailForgotPasswordTemplateId: string;
  public readonly emailNotificationTemplateId: string;

  public readonly apiUrlPostback: string;

  public readonly generateSchema: boolean;

  constructor() {
    // if (!process.version.startsWith("v18.")) {
    // 	throw new Error("Please only use node v18");
    // }

    if (process.env[NODE_ENV] !== "test") {
      if (!process.env[TYPE]) {
        throw new Error(
          'Do not use "npm run start", instead use "npm run start:api", "npm run start:worker", "npm run start:scheduler", etc...',
        );
      }

      this.checkRequiredVars();
    }

    /**
     * -------------------------------------------------------------------------
     * OPTIONAL VARIABLES
     * -------------------------------------------------------------------------
     */
    this.env = process.env[ENV] || "production";
    this.envReal = process.env[ENV_REAL] || "production";
    if (process.env[NODE_ENV]) {
      if (["production", "development", "test"].includes(process.env[NODE_ENV])) {
        this.nodeEnv = process.env[NODE_ENV] as NodeEnv;
      } else {
        throw new Error(`Invalid NODE_ENV: ${process.env[NODE_ENV]}`);
      }
    } else {
      this.nodeEnv = "production";
    }
    if (process.env[LOG_LEVEL]) {
      if (["fatal", "error", "warn", "info", "debug", "trace"].includes(process.env[LOG_LEVEL])) {
        this.logLevel = process.env[LOG_LEVEL] as Level;
      } else {
        throw new Error(`Invalid LOG_LEVEL: ${process.env[LOG_LEVEL]}`);
      }
    } else {
      this.logLevel = "info";
    }
    this.logQueries = `${process.env[LOG_QUERIES]}`.toLowerCase()[0] === "t";
    this.profileJobs = `${process.env[PROFILE_JOBS]}`.toLowerCase()[0] === "t";
    this.port = Number(process.env[PORT]) || 80;
    this.workerPort = Number(process.env[WORKER_PORT]) || 80;
    this.gitSha1 = process.env[GIT_SHA1] || "unknown";
    this.redisPort = Number(process.env[REDIS_PORT]) || 6379;
    this.redisSsl = `${process.env[REDIS_SSL]}`.toLowerCase()[0] === "t";
    this.redisRlPort = Number(process.env[REDIS_RL_PORT]) || 6379;
    this.redisRlSsl = `${process.env[REDIS_RL_SSL]}`.toLowerCase()[0] === "t";
    this.generateSchema = `${process.env[GENERATE_SCHEMA]}`.toLowerCase()[0] === "t";

    /**
     * -------------------------------------------------------------------------
     * REQUIRED VARIABLES
     * -------------------------------------------------------------------------
     */
    if (this.nodeEnv !== "test") {
      if (!isDefined(process.env[TYPE])) {
        throw new Error("Must set TYPE environment variable.");
      }
      if (
        !["api", "worker", "scheduler", "job-watcher", "google", "hourly", "stats-aggregator"].includes(
          process.env[TYPE],
        )
      ) {
        throw new Error(`Invalid TYPE: ${process.env[TYPE]}`);
      }
    }

    // We can safely cast these to strings because we already called
    // checkRequiredVars();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    this.type = process.env[TYPE] as any;
    this.jwtSecret = process.env[JWT_SECRET] as string;
    this.squidsAlphabet = process.env[SQIDS_ALPHABET] as string;
    this.apiUrl = process.env[API_URL] as string;
    this.databaseUrl = process.env[DATABASE_URL] as string;
    this.redisHost = process.env[REDIS_HOST] as string;
    this.redisPassword = process.env[REDIS_PASSWORD] as string;
    this.redisRlHost = process.env[REDIS_RL_HOST] as string;
    this.redisRlPassword = process.env[REDIS_RL_PASSWORD] as string;
    this.frontEndUrl = process.env[FRONT_END_URL] as string;
    this.emailVerifyTemplateId = process.env[EMAIL_VERIFY_TEMPLATE_ID] as string;
    this.emailForgotPasswordTemplateId = process.env[EMAIL_FORGOT_PASSWORD_TEMPLATE_ID] as string;
    this.emailNotificationTemplateId = process.env[EMAIL_NOTIFICATION_TEMPLATE_ID] as string;
    this.apiUrlPostback = process.env[API_URL_POSTBACK] as string;
  }

  private checkRequiredVars(): void {
    const requiredVars: string[] = [TYPE, JWT_SECRET, SQIDS_ALPHABET];

    if (process.env[NODE_ENV] === "production") {
      requiredVars.push(
        API_URL,
        DATABASE_URL,
        REDIS_HOST,
        REDIS_PASSWORD,
        FRONT_END_URL,
        EMAIL_VERIFY_TEMPLATE_ID,
        EMAIL_FORGOT_PASSWORD_TEMPLATE_ID,
        EMAIL_NOTIFICATION_TEMPLATE_ID,
        API_URL_POSTBACK,
      );

      if (process.env[ENV] === "staging") {
        // Staging-specific variables
      }

      // Should only need the rate limiter on the API I think.
      if (process.env[TYPE] === "api") {
        requiredVars.push(REDIS_RL_HOST, REDIS_RL_PASSWORD);
      }
    }

    const missingVars = requiredVars.reduce((vars: string[], v: string) => {
      if (!process.env[v]) {
        vars.push(v);
      }

      return vars;
    }, []);

    if (missingVars.length) {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
  }
}

// Export an instance of the service
export const configService = new ConfigService();
