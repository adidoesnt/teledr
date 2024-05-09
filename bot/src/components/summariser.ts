import axios from "axios";

const {
    SUMMARISER_URL: summariserUrl = "DUMMY-SUMMARISER-URL",
    SUMMARISER_API_KEY: apiKey = "DUMMY-API-KEY",
} = process.env;

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
        return `Here's a summary of the last ${sourceMessagesNum} messages: ${summary}`;
    } catch (error) {
        console.error(error);
        return "Sorry, I couldn't summarise that.";
    }
};
