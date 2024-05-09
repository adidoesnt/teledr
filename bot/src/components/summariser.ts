const { SUMMARY_RATIO = "0.3" } = process.env;
const ratio = parseFloat(SUMMARY_RATIO);

export const getSummary = (text: string, sourceSentenceCount: number) => {
    const targetSentenceCount = Math.round(sourceSentenceCount * ratio);
    return `TLDR for ${targetSentenceCount} messages: ${text}`;
};
