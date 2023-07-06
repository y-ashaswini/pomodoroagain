import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache: cache,
  uri: "http://localhost:3001/api/graphql",
});

export default client;
