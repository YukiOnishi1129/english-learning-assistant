"use client";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import { grammarCheck } from "@/features/grammar/actions/grammar-check";

import { Button } from "@/shared/components/ui/button/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";

const schema = z.object({
  text: z.string().nonempty("Please enter some text"),
});

export const TopGrammarCheckerPage = () => {
  const [isPending, startTransition] = useTransition();
  const [inputText, setInputText] = useState<string | undefined>(undefined);
  const [resultText, setResultText] = useState<string | undefined>(undefined);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: undefined,
    },
  });

  const processText = (text: string) => {
    return text.split("\n\n").map((section, index) => {
      // 見出し（番号付き）を探す
      const match = section.match(/^(\d+)\.\s(.+?)\n/);

      if (match) {
        // 見出しがある場合
        const number = match[1];
        const title = match[2];
        const content = section.replace(match[0], "").split("\n");

        return (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <h3 style={{ color: "#007bff" }}>
              {number}. {title}
            </h3>
            {content.map((line, idx) =>
              line.includes('"') ? (
                <p
                  key={idx}
                  style={{
                    color: "blue",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {line}
                </p>
              ) : (
                <p key={idx} style={{ lineHeight: "1.6", color: "#444" }}>
                  {line}
                </p>
              )
            )}
          </div>
        );
      } else {
        // 見出しがない場合 → 通常の文章として処理
        return (
          <div key={index} style={{ marginBottom: "10px" }}>
            {section.split("\n").map((line, idx) => {
              if (line.startsWith("- ")) {
                return <li key={idx}>{line.replace("- ", "")}</li>;
              } else if (line.includes('"')) {
                return (
                  <p key={idx} style={{ color: "blue", fontWeight: "bold" }}>
                    {line}
                  </p>
                );
              } else {
                return (
                  <p key={idx} style={{ lineHeight: "1.6", color: "#444" }}>
                    {line}
                  </p>
                );
              }
            })}
          </div>
        );
      }
    });
  };

  const onSubmit = form.handleSubmit(
    useCallback(async (values: z.infer<typeof schema>) => {
      startTransition(async () => {
        const text = values.text;

        if (text) {
          const result = await grammarCheck(text);
          setResultText(result);
          setInputText(text);
        }
      });
    }, [])
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Grammar Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your English text here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isPending ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  PLEASE WAIT
                </Button>
              ) : (
                <Button className="w-full sm:w-auto">Check Grammar</Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grammar Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert">
            {resultText && (
              <div className="grid gap-8">
                <div>{inputText}</div>

                <div>{processText(resultText)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
