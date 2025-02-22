"use server";

const WORD_API_BASE_URL = "https://wordsapiv1.p.rapidapi.com/words/";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": process.env.WORD_API_KEY || "",
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
  },
};

export const getWordDefinition = async (word: string) => {
  try {
    const response = await fetch(`${WORD_API_BASE_URL}${word}`, options);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};
