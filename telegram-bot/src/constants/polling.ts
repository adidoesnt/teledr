const { NODE_ENV = "dev" } = process.env;

export const polling = NODE_ENV.toLowerCase() === "dev";