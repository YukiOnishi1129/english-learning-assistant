"use server";
import { ResponseType } from "@/shared/types/response";
import {
  type ShowWordStateType,
  WordAPIResponse,
} from "@/features/word/types/word";
import { transformShowWord } from "@/shared/lib/word";

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
      const result = (await response.json()) as WordAPIResponse;
      const data = transformShowWord(result?.results || []);
      return {
        data: {
          word: result.word,
          results: data,
        },
        status: response.status,
      } as ResponseType<ShowWordStateType>;
    }
    return {
      message: "Word not found",
      status: response.status,
    } as ResponseType<undefined>;
  } catch (error) {
    return {
      message: error,
      status: 500,
    } as ResponseType<undefined>;
  }
};
