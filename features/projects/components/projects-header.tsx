import React from "react";
import { Briefcase } from "lucide-react";

export const ProjectsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Briefcase className="h-7 w-7 text-yashomePink" />
          <span>Real Estate Projects</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Manage promotional real estate developments and project status lifecycle.
        </p>
      </div>
    </div>
  );
};
