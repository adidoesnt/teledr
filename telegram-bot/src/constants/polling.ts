const { BOT_TOKEN = "DUMMY-TOKEN", NODE_ENV = "dev" } = process.env;

export const polling = NODE_ENV.toLowerCase() === "dev";