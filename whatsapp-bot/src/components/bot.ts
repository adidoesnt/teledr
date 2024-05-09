import { Client, type Message } from "whatsapp-web.js";
import puppeteer from "puppeteer";
import qrcode from "qrcode-terminal";
import { tldr } from "handlers/tldr";
import { save } from "./cache";

const { BOT_CHAT_ID } = process.env;

export class Bot {
  client: Client;
  chatId: string;

  constructor() {
    this.client = new Client({
      webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
      },
    });
    this.chatId = `${BOT_CHAT_ID}`;
  }

  registerEvents() {
    this.client.on("qr", (qr) => {
      console.log("received whatsapp qr code", qr);
      qrcode.generate(qr, { small: true });
    });
    this.client.on("authenticated", (session) => {
      console.info("successfully authenticated session", session);
    });
    this.client.on("auth_failure", (msg) => {
      console.error("session authentication unsuccessful", msg);
    });
    this.client.on("ready", () => {
      console.log("whatsapp client is ready");
    });
    this.client.on("disconnected", (reason) => {
      console.warn("whatsapp client was disconnected", reason);
    });
    this.client.on("message", async (msg) => {
      await this.processMessage(msg);
    });
  }

  async initialize() {
    await puppeteer.launch({ headless: true });
    this.registerEvents();
    await this.client.initialize();
  }

  validateChatId(chatId: string | number) {
    if (!chatId) {
      console.warn("chatId is required");
      return false;
    } else if (typeof chatId !== "string" && typeof chatId !== "number") {
      console.warn("chatId must be a string or number");
      return false;
    } else if (`${chatId}` !== this.chatId) {
      console.warn("chatId does not match bot configuration");
      return false;
    }
    return true;
  }

  async processMessage(msg: Message) {
    const {
      from: chatId,
      body,
      id,
      _data: { notifyName },
    } = msg as Message & { _data: { notifyName: string } };
    if (!this.validateChatId(chatId)) return;
    console.debug("received whatsapp message", msg);
    const tokens = body.split(" ");
    const command = tokens[0];
    const msgId = id._serialized;
    if (!command) {
      console.error("command is required");
      return;
    }
    await this.processCommand(command, tokens, msgId, notifyName);
  }

  async saveMessage(messageId: string, tokens: string[], author?: string) {
    try {
      const name = author ?? "Someone";
      const content = `${name}: ${tokens.join(" ")}`;
      console.log("saving message", content);
      await save(messageId, content);
    } catch (error) {
      console.error(error);
    }
  }

  async processCommand(
    command: string,
    tokens: string[],
    msgId: string,
    notifyName?: string
  ) {
    let reply: string = "";
    switch (command) {
      case "/start":
        reply = "Welcome to the bot";
        break;
      case "/help":
        reply = "Help message";
        break;
      case "/tldr":
        reply = await tldr(tokens);
        break;
      default:
        await this.saveMessage(msgId, tokens, notifyName);
        break;
    }
    if (reply.trim() !== "") {
      console.info("sending reply", reply);
      return await this.client.sendMessage(this.chatId, reply, {
        quotedMessageId: msgId,
      });
    } else {
      return;
    }
  }
}
