"use client";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Volume2 } from "lucide-react";

import { getWordDefinition } from "@/actions/word-api";

const schema = z.object({
  keyword: z.string().nonempty("Please enter a keyword"),
});

export const WordLookup = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof schema>) => {
    const word = values.keyword;
    const response = await getWordDefinition(word);
    console.log("❤️‍🔥");
    console.log(response);
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Word Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter a word..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Search</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Definition</span>
              <Button variant="ghost" size="icon">
                <Volume2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium">Part of Speech</dt>
                <dd className="text-muted-foreground">noun, verb</dd>
              </div>
              <div>
                <dt className="font-medium">Meaning</dt>
                <dd className="text-muted-foreground">
                  Definition will appear here...
                </dd>
              </div>
              <div>
                <dt className="font-medium">Example</dt>
                <dd className="text-muted-foreground">
                  Example sentences will appear here...
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium">Synonyms</dt>
                <dd className="text-muted-foreground">
                  Similar words will appear here...
                </dd>
              </div>
              <div>
                <dt className="font-medium">Antonyms</dt>
                <dd className="text-muted-foreground">
                  Opposite words will appear here...
                </dd>
              </div>
              <div>
                <dt className="font-medium">Etymology</dt>
                <dd className="text-muted-foreground">
                  Word origin will appear here...
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
