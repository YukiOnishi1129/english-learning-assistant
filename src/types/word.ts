export type WordAPIResponse = {
  word: string;
  results: Array<WordResult>;
  frequency: number;
  pronunciation: {
    all: string;
  };
  syllables: {
    count: number;
    list: Array<string>;
  };
};

export type WordResult = {
  definition: string;
  examples?: Array<string>;
  partOfSpeech: string;
  synonyms?: Array<string>;
  antonyms?: Array<string>;
  similarTo?: Array<string>;
};

export type ShowWordDefinitionType = {
  definition: string;
  examples?: Array<string>;
  synonyms?: Array<string>;
  antonyms?: Array<string>;
  similarTo?: Array<string>;
};

export type ShowWordResultType = {
  partOfSpeech: string;
  definitions: Array<ShowWordDefinitionType>;
};

export type WordStateType = {
  word: string;
  results: Array<ShowWordResultType>;
};
