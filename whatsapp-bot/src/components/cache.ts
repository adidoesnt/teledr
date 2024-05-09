import { createClient } from "redis";

const {
  REDIS_HOST: host = "localhost",
  REDIS_PORT = "6379",
  REDIS_PASSWORD: password = "",
} = process.env;
const port = parseInt(REDIS_PORT);

export const cache = await createClient({
  socket: {
    host,
    port,
  },
  password,
})
  .on("error", (error) => console.error(error))
  .connect();

export const save = async (key: string, value: string) => {
  cache.set(key, value);
};

export const getMany = async (n: number) => {
  const keys = await cache.keys("*");
  const sortedKeys = keys.sort((a, b) => Number(b) - Number(a));
  if (sortedKeys.length < n) {
    return Promise.all(sortedKeys.map(async (key) => await cache.get(key)));
  }
  return Promise.all(
    sortedKeys.slice(0, n).map(async (key) => await cache.get(key))
  );
};
