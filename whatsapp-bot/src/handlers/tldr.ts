import type { WhatsappMessage } from "components/bot";
import { getSummary } from "components/summariser";

export const tldr = async (tokens: string[], msg: WhatsappMessage) => {
  tokens.shift();
  const limit = tokens[0] ? parseInt(tokens[0]) : 50;
  const chat = await msg.getChat();
  const messages = await chat.fetchMessages({ limit });
  const text = messages
    .filter((msg) => !msg.body.includes("/tldr"))
    .map((msg) => {
      const {
        body,
        _data: { notifyName },
      } = msg as WhatsappMessage;
      return `${notifyName ? `@${notifyName}` : "Someone"}: ${body}`;
    })
    .join("\n");
  const summary = await getSummary(text, limit);
  return summary;
};
