import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { TopGrammarCheckerPage } from "@/features/grammar/components/TopGrammarCheckerPage";
import { TopWordLookupPage } from "@/features/word/components/TopWordLookupPage";
import WritingPractice from "@/shared/components/writing-practice";

import { SearchParamsType } from "@/shared/types/util";

type Page = {
  searchParams: Promise<SearchParamsType>;
};

export default async function Page({ searchParams }: Page) {
  const q = await searchParams;

  const tab: string = typeof q["tab"] === "string" ? q["tab"] : "grammar";
  let defaultTab: "grammar" | "word" | "writing" = "grammar";
  if (tab === "grammar" || tab === "word" || tab === "writing") {
    defaultTab = tab;
  }

  const keyword: string = typeof q["keyword"] === "string" ? q["keyword"] : "";

  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="grammar">Grammar Check</TabsTrigger>
        <TabsTrigger value="word">Word Lookup</TabsTrigger>
        <TabsTrigger value="writing">Writing Practice</TabsTrigger>
      </TabsList>
      <TabsContent value="grammar">
        <TopGrammarCheckerPage />
      </TabsContent>
      <TabsContent value="word">
        <TopWordLookupPage keyword={keyword} />
      </TabsContent>
      <TabsContent value="writing">
        <WritingPractice />
      </TabsContent>
    </Tabs>
  );
}
