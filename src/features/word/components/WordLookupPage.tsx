"use client";
import { useRouter } from "next/navigation";
import { FC, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { WordLookupTemplate } from "./WordLookupTemplate";

import { sortPartOfSpeechArray } from "@/shared/lib/word";

import { type ShowWordStateType } from "@/features/word/types/word";
import { type ResponseType } from "@/shared/types/response";

const schema = z.object({
  keyword: z.string().nonempty("Please enter a keyword"),
});

type WordLookupPageProps = {
  keyword?: string;
};

export const WordLookupPage: FC<WordLookupPageProps> = ({ keyword }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: keyword || "",
    },
  });
  const res = queryClient.getQueryData<
    ResponseType<ShowWordStateType | undefined>
  >(["word", keyword || ""]);

  const partOfSpeechList = useMemo(() => {
    const resultList: Array<string> = [];
    if (res?.data?.results) {
      res.data?.results.forEach((result) => {
        if (!resultList.includes(result.partOfSpeech)) {
          resultList.push(result.partOfSpeech);
        }
      });
    }
    return sortPartOfSpeechArray(resultList);
  }, [res?.data?.results]);

  const onSubmit = form.handleSubmit(
    useCallback(
      async (values: z.infer<typeof schema>) => {
        const word = values.keyword;

        if (word) {
          router.replace("/word-lookup?keyword=" + word);
        }
      },
      [router]
    )
  );

  const resData = res?.data;

  return (
    <WordLookupTemplate
      data={resData}
      form={form}
      partOfSpeechList={partOfSpeechList}
      onSubmit={onSubmit}
    />
  );
};
