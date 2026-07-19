import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProjectsErrorProps {
  description?: string;
  onRetry: () => void;
}

export const ProjectsError: React.FC<ProjectsErrorProps> = ({
  description = "Failed to load real estate projects from server.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-card border border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
      <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Unable to load projects</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
        {description}
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="cursor-pointer border-border hover:bg-muted/30 flex items-center gap-1.5 font-bold h-10 px-4 rounded-md transition-all text-sm bg-card text-foreground"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Retry Request</span>
      </Button>
    </div>
  );
};
