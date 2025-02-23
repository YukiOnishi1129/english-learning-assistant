"use client";
import { FC, useCallback, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

type SpeakButtonProps = ComponentProps<typeof Button> & {
  text: string;
};

export const SpeakButton: FC<SpeakButtonProps> = ({
  variant = "ghost",
  text,
}) => {
  const handleSpeechEnglish = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }, [text]);

  return (
    <Button variant={variant} size="icon" onClick={() => handleSpeechEnglish()}>
      <Volume2 className="h-4 w-4" />
    </Button>
  );
};
