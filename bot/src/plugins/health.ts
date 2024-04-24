import { Elysia } from "elysia";

const { NAME = "bot" } = process.env;

export const health = new Elysia()
    .get("/", () => `${NAME} is running!`);
