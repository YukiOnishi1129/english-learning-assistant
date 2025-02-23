import { WordLookup } from "@/components/word-lookup";

import { SearchParamsType } from "@/types/util";

type WordLookupPageProps = {
  searchParams: Promise<SearchParamsType>;
};

export default async function WordLookupPage({
  searchParams,
}: WordLookupPageProps) {
  const q = await searchParams;

  const keyword: string = typeof q["keyword"] === "string" ? q["keyword"] : "";

  return <WordLookup keyword={keyword} />;
}
