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

const comparator = (a: string, b: string) => {
    const [_, aId] = a.split(":");
    const [__, bId] = b.split(":");
    return Number(bId) - Number(aId);
};

export const getMany = async (prefix: number, n: number) => {
    const keys = await cache.keys(`${prefix}:*`);
    const sortedKeys = keys.sort(comparator);
    if (sortedKeys.length < n) {
        return Promise.all(sortedKeys.map(async (key) => await cache.get(key)));
    }
    return Promise.all(
        sortedKeys.slice(0, n).map(async (key) => await cache.get(key))
    );
};
