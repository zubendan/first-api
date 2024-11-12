import apollo from "@elysiajs/apollo";
import Elysia from "elysia";

export const testResolver = new Elysia({ name: "api/resolver" }).use(
  apollo({
    typeDefs: `
        type Query {
        hello: String
        }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello, World!",
      },
    },
  }),
);
