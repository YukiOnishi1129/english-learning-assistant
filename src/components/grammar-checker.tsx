import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrammarChecker() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Grammar Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your English text here..."
            className="min-h-[200px]"
          />
          <Button className="w-full sm:w-auto">Check Grammar</Button>
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
}
