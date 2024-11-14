import apollo from "@elysiajs/apollo";
import Elysia from "elysia";

export const authResolver = new Elysia({ name: "api/resolver" }).use(
  apollo({
    typeDefs: `
          type Query {
          login: String
          }
      `,
    resolvers: {
      Query: {
        login: () => "Hello, World!",
      },
    },
  }),
);
