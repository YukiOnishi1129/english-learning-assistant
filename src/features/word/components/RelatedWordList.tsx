" use client";
import NextLink from "next/link";
import { FC } from "react";

import { SpeakButton } from "@/shared/components/ui/button";

type RelatedWordListProps = {
  title: string;
  wordList: Array<string>;
};

export const RelatedWordList: FC<RelatedWordListProps> = ({
  title,
  wordList,
}) => {
  return (
    <>
      <h6 className="font-medium  text-sm">{title}</h6>
      <div className="text-muted-foreground flex">
        {wordList.map((word, i) => (
          <div key={`${word}-${i}`} className="flex">
            <p className="text-sm flex items-center">
              {i != 0 && <span>, &nbsp;&nbsp;</span>}
              <NextLink href={`/word-lookup?keyword=${word}`} target="_blank">
                {word}
              </NextLink>
            </p>
            <SpeakButton text={word} />
          </div>
        ))}
      </div>
    </>
  );
};
