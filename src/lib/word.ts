import type {
  WordResult,
  ShowWordResultType,
  ShowWordDefinitionType,
} from "@/types/word";

const partOfSpeechOrder: Record<string, number> = {
  noun: 1,
  verb: 2,
  adjective: 3,
  adverb: 4,
};

export const sortPartOfSpeechArray = (arr: Array<string>): Array<string> => {
  return arr.sort((a, b) => {
    const orderA = partOfSpeechOrder[a] || 999; // 該当しない場合は最後に
    const orderB = partOfSpeechOrder[b] || 999;
    return orderA - orderB;
  });
};

const sortResultsByPartOfSpeech = (
  results: Array<WordResult>
): Array<WordResult> => {
  return results.sort((a, b) => {
    const orderA = partOfSpeechOrder[a.partOfSpeech] || 999; // 該当しない場合は最後に
    const orderB = partOfSpeechOrder[b.partOfSpeech] || 999;
    return orderA - orderB;
  });
};

export const transformShowWord = (
  results: Array<WordResult>
): Array<ShowWordResultType> => {
  // partOfSpeech ごとにデータをグループ化
  const groupedResults: Record<string, ShowWordDefinitionType[]> = {};

  const sortedResults = sortResultsByPartOfSpeech(results);

  sortedResults.forEach((result) => {
    const {
      partOfSpeech,
      definition,
      examples,
      synonyms,
      antonyms,
      similarTo,
    } = result;

    if (!groupedResults[partOfSpeech]) {
      groupedResults[partOfSpeech] = [];
    }

    groupedResults[partOfSpeech].push({
      definition,
      examples,
      synonyms,
      antonyms,
      similarTo,
    });
  });

  // グループ化したデータを ShowWordResultType の配列に変換
  const showResults: ShowWordResultType[] = Object.entries(groupedResults).map(
    ([partOfSpeech, definitions]) => ({
      partOfSpeech,
      definitions,
    })
  );

  return showResults;
};
