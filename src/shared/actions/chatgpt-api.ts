"use server";
import OpenAI from "openai";

// const API_URL = "https://api.openai.com/v1/";
const MODEL = "gpt-3.5-turbo";
// const MODEL = "gpt-4o";
const API_KEY = process.env.CHATGPT_API_KEY;

const client = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});

export const openApiRequest = async (prompt: string) => {
  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
