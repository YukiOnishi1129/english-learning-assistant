"use client";
import { useCallback, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Volume2 } from "lucide-react";

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

export const WordLookup = () => {
  const [word, setWord] = useState<WordStateType | undefined>(undefined);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: "",
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
  const transformWord = (
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
    const showResults: ShowWordResultType[] = Object.entries(
      groupedResults
    ).map(([partOfSpeech, definitions]) => ({
      partOfSpeech,
      definitions,
    }));

    return showResults;
  };

  const onSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      const word = values.keyword;
      const response = await getWordDefinition(word);
      if (response?.data) {
        setWord({
          word: response.data.word,
          results: transformWord(response.data.results),
        });
      }
    },
    [sortResultsByPartOfSpeech]
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

      {word && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
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

                <Button variant="ghost" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
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
                                  <p
                                    key={`${example}-${i}`}
                                    className="text-muted-foreground"
                                  >
                                    ・{example}
                                  </p>
                                ))}
                              </>
                            )}
                            {result.synonyms && (
                              <>
                                <dt className="font-medium  text-sm">
                                  Synonyms
                                </dt>
                                <dd className="text-muted-foreground flex gap-2">
                                  {result.synonyms.map((synonym, i) => (
                                    <span
                                      key={`${synonym}-${i}`}
                                      className="text-sm"
                                    >
                                      {synonym},
                                    </span>
                                  ))}
                                </dd>
                              </>
                            )}
                            {result.antonyms && (
                              <>
                                <dt className="font-medium">Antonyms</dt>
                                <dd className="text-muted-foreground flex gap-2">
                                  {result.antonyms.map((antonyms, i) => (
                                    <span
                                      key={`${antonyms}-${i}`}
                                      className="text-sm"
                                    >
                                      {antonyms},
                                    </span>
                                  ))}
                                </dd>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* <div className="border-t border-muted-foreground py-4" />
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium">Meaning</dt>
                  <dd className="text-muted-foreground">
                    Definition will appear here...
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Example</dt>
                  <dd className="text-muted-foreground">
                    Example sentences will appear here...
                  </dd>
                </div>
              </dl> */}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium">Synonyms</dt>
                  <dd className="text-muted-foreground">
                    Similar words will appear here...
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Antonyms</dt>
                  <dd className="text-muted-foreground">
                    Opposite words will appear here...
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Etymology</dt>
                  <dd className="text-muted-foreground">
                    Word origin will appear here...
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card> */}
        </div>
      )}
    </div>
  );
};
