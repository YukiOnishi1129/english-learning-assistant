import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { WordLookupPageTemplate } from "@/features/word/components/WordLookupPageTemplate";

import { getShowWord } from "@/features/word/actions/word";

import { SearchParamsType } from "@/shared/types/util";

type WordLookupPageProps = {
  searchParams: Promise<SearchParamsType>;
};

export default async function WordLookupPage({
  searchParams,
}: WordLookupPageProps) {
  const queryClient = new QueryClient();
  const q = await searchParams;

  const keyword: string = typeof q["keyword"] === "string" ? q["keyword"] : "";

  if (keyword) {
    await queryClient.prefetchQuery({
      queryKey: ["word", keyword || ""],
      queryFn: async () => getShowWord(keyword || ""),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WordLookupPageTemplate keyword={keyword} />
    </HydrationBoundary>
  );
}
