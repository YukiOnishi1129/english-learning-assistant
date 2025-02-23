import { WordLookup } from "@/shared/components/word-lookup";

import { SearchParamsType } from "@/shared/types/util";

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
