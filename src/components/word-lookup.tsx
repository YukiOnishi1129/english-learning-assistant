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

import type { WordDefinitionType, WordResult } from "@/types/word";

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
  let nounCount = 0;
  let verbCount = 0;
  let adjectiveCount = 0;
  let adverbCount = 0;
  const [word, setWord] = useState<WordDefinitionType | undefined>(undefined);

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

  const onSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      const word = values.keyword;
      const response = await getWordDefinition(word);
      if (response?.data) {
        console.log("❤️‍🔥");
        console.log(response);
        setWord({
          word: response.data.word,
          results: sortResultsByPartOfSpeech(response.data.results),
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
                let count = 0;
                switch (result.partOfSpeech) {
                  case "noun":
                    nounCount++;
                    count = nounCount;
                    break;
                  case "verb":
                    verbCount++;
                    count = verbCount;
                    break;
                  case "adjective":
                    adjectiveCount++;
                    count = adjectiveCount;
                    break;
                  case "adverb":
                    adverbCount++;
                    count = adverbCount;
                    break;
                }
                return (
                  <div key={result.definition}>
                    <dl className="space-y-4 border-t py-4">
                      <div>
                        <dt className="font-medium">
                          {result.partOfSpeech}: {count}
                        </dt>
                        <dd className="text-muted-foreground">
                          {result.definition}
                        </dd>
                      </div>
                      {result.example && (
                        <div>
                          <dt className="font-medium">Example</dt>
                          <dd className="text-muted-foreground">
                            {result.example}
                          </dd>
                        </div>
                      )}
                      {result.synonyms && (
                        <div>
                          <dt className="font-medium">Synonyms</dt>
                          <dd className="text-muted-foreground flex gap-2">
                            {result.synonyms.map((synonym, i) => (
                              <span key={`${synonym}-$i}`} className="text-sm">
                                {synonym},
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      {result.antonyms && (
                        <div>
                          <dt className="font-medium">Antonyms</dt>
                          <dd className="text-muted-foreground flex gap-2">
                            {result.antonyms.map((antonyms, i) => (
                              <span key={`${antonyms}-$i}`} className="text-sm">
                                {antonyms},
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
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
