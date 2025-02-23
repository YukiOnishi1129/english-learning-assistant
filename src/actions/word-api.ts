"use server";
import { ResponseType } from "@/types/response";
import { WordAPIResponse } from "@/types/word";

const WORD_API_BASE_URL = "https://wordsapiv1.p.rapidapi.com/words/";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": process.env.WORD_API_KEY || "",
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
  },
};

export const getWordDefinitionApi = async (word: string) => {
  try {
    const response = await fetch(`${WORD_API_BASE_URL}${word}`, options);
    if (response.status === 200) {
      const result = await response.json();
      return {
        data: result,
        status: response.status,
      } as ResponseType<WordAPIResponse>;
    }
    return {
      message: "Word not found",
      status: response.status,
    };
  } catch (error) {
    console.log(error);
  }
};
