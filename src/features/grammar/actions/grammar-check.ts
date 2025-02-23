"use server";

import { openApiRequest } from "@/shared/actions/chatgpt-api";

export const grammarCheck = async (text: string) => {
  const prompt = `次に書く英文の英文法解説をお願いします。${text}`;
  const res = await openApiRequest(prompt);

  if (res?.choices[0]?.message?.content) {
    return res.choices[0].message.content;
  }
};
