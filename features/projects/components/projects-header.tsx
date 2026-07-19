import React from "react";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsHeaderProps {
  onAddProject?: () => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onAddProject }) => {
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

      {onAddProject && (
        <Button
          onClick={onAddProject}
          className="cursor-pointer bg-yashomePink text-white hover:bg-yashomePink/90 font-bold h-10 px-4 rounded-md transition-all text-sm flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      )}
    </div>
  );
};
