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
  example: Array<string>;
  partOfSpeech: string;
  synonyms?: Array<string>;
  antonyms?: Array<string>;
  similarTo?: Array<string>;
};

export type WordDefinitionType = {
  word: string;
  results: Array<WordResult>;
};
