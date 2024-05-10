import Client, { Message } from "node-telegram-bot-api";
import { polling } from "constants/polling";
import { tldr } from "./handlers/tldr";
import { save } from "./cache";

const { BOT_TOKEN = "DUMMY-TOKEN", WEBHOOK_URL = "DUMMY_URL" } = process.env;

export const processMessage = async (message: Message) => {
    const { chat, text } = message;
    try {
        if (!text) {
            throw new Error("No text in message");
        }
        const tokens = text.split(" ");
        const command = tokens[0];
        switch (command) {
            case "/start":
                return { chat, text: "Welcome to the bot" };
            case "/help":
                return { chat, text: "Help message" };
            case "/tldr":
                return await tldr(chat, tokens);
            default:
                return await saveMessage(message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const getKey = (chatId: number, messageId: string) => {
    return `${chatId}:${messageId}`;
}

export const saveMessage = async (message: Message) => {
    try {
        const { text, message_id, from, chat } = message;
        const messageId = message_id.toString();
        const { id: chatId } = chat;
        if (!from) {
            throw new Error("No from in message");
        }
        const { username, first_name } = from;
        const author = first_name ?? username;
        const content = `${author}: ${text}`;
        const key = getKey(chatId, messageId);
        await save(key, content);
        console.log(`Saved message: ${content}`);
    } catch (error) {
        console.error(error);
    }
};

export const getClient = () => {
    const client = new Client(BOT_TOKEN, { polling });
    if (!polling) client.setWebHook(`${WEBHOOK_URL}${BOT_TOKEN}`);
    client.on("message", async (message: Message) => {
        const reply = await processMessage(message);
        if (reply) {
            const { chat, text } = reply;
            client.sendMessage(chat.id, text);
        }
    });
    return client;
};
