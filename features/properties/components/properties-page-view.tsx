import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export function PropertiesPageView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Properties</h1>
      </div>
      <Card className="border border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-yashomePink" />
            Under Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Properties catalog management system is currently under development and will be available in a future release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
