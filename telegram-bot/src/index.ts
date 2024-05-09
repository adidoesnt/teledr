import { Elysia } from "elysia";
import { health, webhook } from "plugins";
import { getClient } from "components/client";

const { PORT = 3000 } = process.env;

const app = new Elysia().use(health).use(webhook).listen(PORT);
const { server } = app;

export const client = getClient();

if (server) {
    const { hostname, port } = server;
    console.log(`🦊 Elysia is running at ${hostname}:${port}!`);
} else {
    console.error("🦊 Elysia failed to start...");
}
