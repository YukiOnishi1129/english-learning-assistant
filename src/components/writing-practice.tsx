import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WritingPractice() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Writing Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select grammar topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relative">Relative Pronouns</SelectItem>
              <SelectItem value="passive">Passive Voice</SelectItem>
              <SelectItem value="conditional">Conditional Sentences</SelectItem>
              <SelectItem value="perfect">Perfect Tenses</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practice Exercise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">Translate the following sentence:</p>
            <p className="mt-2 text-muted-foreground">
              私が昨日会った人は、私の新しい先生です。
            </p>
          </div>
          <Textarea
            placeholder="Write your English translation here..."
            className="min-h-[100px]"
          />
          <Button>Check Answer</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert">
            <p>Your feedback will appear here...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
