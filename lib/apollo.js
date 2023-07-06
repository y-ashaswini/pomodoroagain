import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache: cache,
  uri: "https://pomodoroagain.vercel.app/api/graphql",
});

export default client;
