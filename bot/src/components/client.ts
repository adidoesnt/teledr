import Client from "node-telegram-bot-api";
import { polling } from "constants/polling";

const { BOT_TOKEN = "DUMMY-TOKEN", WEBHOOK_URL = "DUMMY_URL" } = process.env;

export const getClient = () => {
    const client = new Client(BOT_TOKEN, { polling });
    if (!polling) client.setWebHook(`${WEBHOOK_URL}${BOT_TOKEN}`);
    client.on("message", ({ chat, text }) => {
        client.sendMessage(chat.id, `Message received: ${text}`);
    });
    return client;
};
