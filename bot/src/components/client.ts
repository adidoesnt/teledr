import Client, { Message } from "node-telegram-bot-api";
import { polling } from "constants/polling";

const { BOT_TOKEN = "DUMMY-TOKEN", WEBHOOK_URL = "DUMMY_URL" } = process.env;

export const processMessage = async (message: Message) => {
    const { chat, text } = message;
    return { chat, text: `Message received: ${text}` };
};

export const getClient = () => {
    const client = new Client(BOT_TOKEN, { polling });
    if (!polling) client.setWebHook(`${WEBHOOK_URL}${BOT_TOKEN}`);
    client.on("message", async (message: Message) => {
        const reply = await processMessage(message);
        const { chat, text } = reply;
        client.sendMessage(chat.id, text);
    });
    return client;
};
