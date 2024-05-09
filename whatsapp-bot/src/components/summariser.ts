import axios from "axios";

const {
  SUMMARISER_URL: summariserUrl = "DUMMY-SUMMARISER-URL",
  SUMMARISER_API_KEY: apiKey = "DUMMY-API-KEY",
} = process.env;

const ERR_MSG = "Sorry, I couldn't summarise that.";

export const getSummary = async (text: string, sourceMessagesNum: number) => {
  try {
    const body = {
      content: text,
    };
    const response = await axios.post(`${summariserUrl}/summarise`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
    });
    const { data } = response;
    const { summary } = data;
    return summary ?? ERR_MSG;
  } catch (error) {
    console.error(error);
    return ERR_MSG;
  }
};
