"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { WordLookupTemplate } from "./WordLookupTemplate";

import { getWordDefinitionApi } from "@/features/word/actions/word-api";

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

  const onSubmit = form.handleSubmit(
    useCallback(async (values: z.infer<typeof schema>) => {
      const word = values.keyword;

      if (word) {
        setInputKeyword(word);
      }
    }, [])
  );

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const resData = data?.data;

  return (
    <WordLookupTemplate
      isLoading={isLoading}
      data={resData}
      form={form}
      partOfSpeechList={partOfSpeechList}
      onSubmit={onSubmit}
    />
  );
};
