import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrammarChecker from "@/components/grammar-checker";
import { WordLookup } from "@/components/word-lookup";
import WritingPractice from "@/components/writing-practice";

import { SearchParamsType } from "@/types/util";

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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="pl-4 py-4">
          <h1 className="text-2xl font-bold">English Learning Assistant</h1>
        </div>
      </header>
      <main className="py-6 container m-auto">
        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grammar">Grammar Check</TabsTrigger>
            <TabsTrigger value="word">Word Lookup</TabsTrigger>
            <TabsTrigger value="writing">Writing Practice</TabsTrigger>
          </TabsList>
          <TabsContent value="grammar">
            <GrammarChecker />
          </TabsContent>
          <TabsContent value="word">
            <WordLookup keyword={keyword} />
          </TabsContent>
          <TabsContent value="writing">
            <WritingPractice />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
