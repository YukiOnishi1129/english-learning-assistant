"use client";
import NextLink from "next/link";
import { FC, useCallback, useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RingLoader } from "react-spinners";

import { SpeakButton, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { getWordDefinition } from "@/actions/word-api";

import type {
  WordStateType,
  WordResult,
  ShowWordResultType,
  ShowWordDefinitionType,
} from "@/types/word";

const schema = z.object({
  keyword: z.string().nonempty("Please enter a keyword"),
});

const partOfSpeechOrder: Record<string, number> = {
  noun: 1,
  verb: 2,
  adjective: 3,
  adverb: 4,
};

type WordLookupProps = {
  keyword?: string;
};

export const WordLookup: FC<WordLookupProps> = ({ keyword }) => {
  const [word, setWord] = useState<WordStateType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: keyword || "",
    },
  });

  const sortResultsByPartOfSpeech = (
    results: Array<WordResult>
  ): Array<WordResult> => {
    return results.sort((a, b) => {
      const orderA = partOfSpeechOrder[a.partOfSpeech] || 999; // 該当しない場合は最後に
      const orderB = partOfSpeechOrder[b.partOfSpeech] || 999;
      return orderA - orderB;
    });
  };

  const sortPartOfSpeechArray = (arr: Array<string>): Array<string> => {
    return arr.sort((a, b) => {
      const orderA = partOfSpeechOrder[a] || 999; // 該当しない場合は最後に
      const orderB = partOfSpeechOrder[b] || 999;
      return orderA - orderB;
    });
  };

  // **変換関数**
  const transformWord = useCallback(
    (results: Array<WordResult>): Array<ShowWordResultType> => {
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
      const showResults: ShowWordResultType[] = Object.entries(
        groupedResults
      ).map(([partOfSpeech, definitions]) => ({
        partOfSpeech,
        definitions,
      }));

      return showResults;
    },
    []
  );

  const partOfSpeechList = useMemo(() => {
    const resultList: Array<string> = [];
    if (word) {
      word.results.forEach((result) => {
        if (!resultList.includes(result.partOfSpeech)) {
          resultList.push(result.partOfSpeech);
        }
      });
    }
    return sortPartOfSpeechArray(resultList);
  }, [word]);

  const fetchWordDefinition = useCallback(
    async (word: string) => {
      setLoading(true);
      const response = await getWordDefinition(word);
      if (response?.data) {
        setWord({
          word: response.data.word,
          results: transformWord(response.data.results),
        });
      }
      setLoading(false);
    },
    [transformWord]
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      const word = values.keyword;
      fetchWordDefinition(word);
    },
    [fetchWordDefinition]
  );

  useEffect(() => {
    if (keyword) {
      fetchWordDefinition(keyword);
      form.setValue("keyword", keyword);
    }
  }, [keyword, fetchWordDefinition, form]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Word Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter a word..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Search</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="w-full h-48 flex items-center justify-center">
          <RingLoader size={48} />
        </div>
      )}

      {!loading && word && (
        <div className="grid gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="gap-2 grid grid-flow-col auto-cols-max items-end">
                  <h5>{word.word}</h5>
                  {partOfSpeechList.map((partOfSpeech) => (
                    <span
                      key={partOfSpeech}
                      className="text-muted-foreground text-sm"
                    >
                      {partOfSpeech}
                    </span>
                  ))}
                </div>
                <SpeakButton text={word.word} />
              </CardTitle>
            </CardHeader>

            <CardContent>
              {word.results.map((result) => {
                return (
                  <div
                    key={result.partOfSpeech}
                    className="space-y-4 border-t py-4"
                  >
                    <h2 className="font-medium">{result.partOfSpeech}</h2>
                    <div className="grid gap-2">
                      {result.definitions.map((result, i) => (
                        <div
                          key={`${result.definition}-${i}`}
                          className="pl-4 grid gap-2"
                        >
                          <p className="font-medium">
                            {i + 1}: {result.definition}
                          </p>
                          <div className="pl-8 grid gap-2">
                            {result.examples && (
                              <>
                                <h6 className="font-medium text-sm">Example</h6>
                                {result.examples.map((example, i) => (
                                  <div
                                    key={`${example}-${i}`}
                                    className="flex gap-2"
                                  >
                                    <p
                                      key={`${example}-${i}`}
                                      className="text-muted-foreground flex items-center"
                                    >
                                      ・{example}
                                    </p>
                                    <SpeakButton text={example} />
                                  </div>
                                ))}
                              </>
                            )}
                            {result.synonyms && (
                              <RelatedWordList
                                title="Synonyms"
                                wordList={result.synonyms}
                              />
                            )}
                            {result.antonyms && (
                              <RelatedWordList
                                title="Antonyms"
                                wordList={result.antonyms}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

type RelatedWordListProps = {
  title: string;
  wordList: Array<string>;
};

const RelatedWordList: FC<RelatedWordListProps> = ({ title, wordList }) => {
  return (
    <>
      <h6 className="font-medium  text-sm">{title}</h6>
      <div className="text-muted-foreground flex">
        {wordList.map((word, i) => (
          <div key={`${word}-${i}`} className="flex">
            <p className="text-sm flex items-center">
              {i != 0 && <span>, &nbsp;&nbsp;</span>}
              <NextLink href={`?tab=word&keyword=${word}`}>{word}</NextLink>
            </p>
            <SpeakButton text={word} />
          </div>
        ))}
      </div>
    </>
  );
};
