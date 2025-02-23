import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { WordLookupPage as Template } from "@/features/word/components/WordLookupPage";

import { getWordDefinitionApi } from "@/features/word/actions/word-api";

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
      queryFn: async () => getWordDefinitionApi(keyword || ""),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Template keyword={keyword} />
    </HydrationBoundary>
  );
}
