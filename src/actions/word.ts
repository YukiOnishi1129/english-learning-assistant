"use server";
import { getWordDefinitionApi } from "./word-api";

import { transformShowWord } from "@/lib/word";
import type { ShowWordStateType } from "@/types/word";

export const getShowWord = async (
  word: string
): Promise<ShowWordStateType | undefined> => {
  const response = await getWordDefinitionApi(word);

  if (response?.data) {
    const { word, results } = response.data;
    return {
      word,
      results: transformShowWord(results),
    };
  }
};
