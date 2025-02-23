"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RingLoader } from "react-spinners";

import { getWordDefinitionApi } from "@/features/word/actions/word-api";

import { RelatedWordList } from "@/features/word/components/RelatedWordList";

import { SpeakButton, Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";

import { sortPartOfSpeechArray } from "@/shared/lib/word";

const schema = z.object({
  keyword: z.string().nonempty("Please enter a keyword"),
});

type TopWordLookupTemplateProps = {
  keyword?: string;
};

export const TopWordLookupTemplate: FC<TopWordLookupTemplateProps> = ({
  keyword,
}) => {
  const [inputKeyword, setInputKeyword] = useState(keyword);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: keyword || "",
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["word", inputKeyword || ""],
    queryFn: async () => getWordDefinitionApi(inputKeyword || ""),
    enabled: !!inputKeyword,
  });

  const partOfSpeechList = useMemo(() => {
    const resultList: Array<string> = [];
    if (data?.data?.results) {
      data?.data?.results.forEach((result) => {
        if (!resultList.includes(result.partOfSpeech)) {
          resultList.push(result.partOfSpeech);
        }
      });
    }
    return sortPartOfSpeechArray(resultList);
  }, [data?.data?.results]);

  const onSubmit = useCallback(async (values: z.infer<typeof schema>) => {
    const word = values.keyword;

    if (word) {
      setInputKeyword(word);
    }
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

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
              <Button disabled={isLoading}>Search</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="w-full h-48 flex items-center justify-center">
          <RingLoader size={48} />
        </div>
      )}

      {!isLoading && data?.data?.word && (
        <div className="grid gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="gap-2 grid grid-flow-col auto-cols-max items-end">
                  <h5>{data.data.word}</h5>
                  {partOfSpeechList.map((partOfSpeech) => (
                    <span
                      key={partOfSpeech}
                      className="text-muted-foreground text-sm"
                    >
                      {partOfSpeech}
                    </span>
                  ))}
                </div>
                <SpeakButton text={data.data.word} />
              </CardTitle>
            </CardHeader>

            <CardContent>
              {data?.data?.results &&
                data?.data.results.map((result) => {
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
                                  <h6 className="font-medium text-sm">
                                    Example
                                  </h6>
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
