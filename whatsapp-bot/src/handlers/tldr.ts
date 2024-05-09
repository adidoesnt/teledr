import { getMany } from "components/cache";
import { getSummary } from "components/summariser";

export const tldr = async (tokens: string[]) => {
  const numMessages = tokens[0] ? parseInt(tokens[0]) : 50;
  const messages = await getMany(numMessages);
  const text = messages.join("\n");
  const summary = await getSummary(text, numMessages);
  return summary;
};
