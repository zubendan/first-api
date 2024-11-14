import type { ApolloServerOptionsWithTypeDefs, BaseContext } from "@apollo/server";
import apollo from "@elysiajs/apollo";
import Elysia from "elysia";

export type resolvers = ApolloServerOptionsWithTypeDefs<BaseContext>["resolvers"];

const aResolvers: ApolloServerOptionsWithTypeDefs<BaseContext>["resolvers"] = {
  Query: {
    a: () => "a",
    b: () => "b",
  },
  Mutation: {
    ma: () => "ma",
  },
};

const bResolvers = {
  Query: {
    c: () => "c",
    d: () => "d",
  },
  Mutation: {
    mb: () => "mb",
  },
};

export const testResolver = new Elysia({ name: "api/resolver" }).use(
  apollo({
    typeDefs() {
      return `
        type Query {
          a: String
          b: String
          c: String
          d: String
        }
        type Mutation {
          ma: String
          mb: String
        }
      `;
    },
    resolvers: {
      ...aResolvers,
      ...bResolvers,
    },
  }),
);
