import { createYoga, createSchema } from "graphql-yoga";
import typeDefs from "@/server/graphql/schema";
import resolvers from "@/server/graphql/resolvers";

export default createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  graphqlEndpoint: "/api/graphql",
  // fetchAPI: { Response },
});

// export { handleRequest as GET, handleRequest as POST };

export const config = {
  api: {
    bodyParser: false,
  },
};
