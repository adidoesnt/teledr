import { Elysia } from "elysia";
import { Update } from "node-telegram-bot-api"
import { polling } from "../constants/polling";
import { ERROR } from "../constants/error";
import { client } from "..";

const { BOT_TOKEN = "DUMMY-TOKEN" } = process.env;
const route = `/${BOT_TOKEN}`;

export const webhook = new Elysia().post(route, ({ set, body }) => {
    try {
        if (polling)
            throw new Error("Webhook is not available in polling mode");
        client.processUpdate(body as Update);
        set.status = 200;
        return "OK";
    } catch (error) {
        console.error(error);
        const { code, message } = ERROR.INTERNAL;
        set.status = code;
        return message;
    }
});
