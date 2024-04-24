import { Elysia } from "elysia";

const { NAME = 'bot', PORT = 3001 } = process.env;

const app = new Elysia().get("/", () => `${NAME} is running!`).listen(PORT);
const { server } = app;

if(server) {
  const { hostname, port } = server;
  console.log(`🦊 Elysia is running at ${hostname}:${port}!`);
} else {
  console.error("🦊 Elysia failed to start...");
}
