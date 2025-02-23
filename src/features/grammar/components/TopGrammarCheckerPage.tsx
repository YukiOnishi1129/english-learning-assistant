"use client";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: undefined,
    },
  });

  const onSubmit = form.handleSubmit(
    useCallback(async (values: z.infer<typeof schema>) => {
      const text = values.text;

      if (text) {
      }
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
              <Button className="w-full sm:w-auto">Check Grammar</Button>
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
            <p>Your grammar analysis will appear here...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
