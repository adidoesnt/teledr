import { getMany } from "components/cache";
import { getSummary } from "components/summariser";
import Client from "node-telegram-bot-api";

export const tldr = async (chat: Client.Chat, tokens: string[]) => {
    tokens.shift();
    const numMessages = tokens[0] ? parseInt(tokens[0]) : 50;
    const messages = await getMany(numMessages);
    const text = messages.join("\n");
    const summary = await getSummary(text, numMessages);
    return { chat, text: summary };
};
