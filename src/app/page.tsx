"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrammarChecker from "@/components/grammar-checker";
import WordLookup from "@/components/word-lookup";
import WritingPractice from "@/components/writing-practice";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">English Learning Assistant</h1>
        </div>
      </header>
      <main className="container py-6">
        <Tabs defaultValue="grammar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grammar">Grammar Check</TabsTrigger>
            <TabsTrigger value="word">Word Lookup</TabsTrigger>
            <TabsTrigger value="writing">Writing Practice</TabsTrigger>
          </TabsList>
          <TabsContent value="grammar">
            <GrammarChecker />
          </TabsContent>
          <TabsContent value="word">
            <WordLookup />
          </TabsContent>
          <TabsContent value="writing">
            <WritingPractice />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
