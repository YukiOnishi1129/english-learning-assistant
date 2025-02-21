import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export default function WordLookup() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Word Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter a word..." />
            <Button>Search</Button>
          </div>
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
}
