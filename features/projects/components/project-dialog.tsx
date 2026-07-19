"use client";

import React from "react";
import { ProjectForm } from "./project-form";
import { ProjectFormData } from "../schemas/project.schema";
import { Project } from "@/services/projects/projects.service";
import { X, Briefcase } from "lucide-react";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  editingProject?: Project | null;
  isSubmitting?: boolean;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingProject,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-yashomePink/10 text-yashomePink flex items-center justify-center border border-yashomePink/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {editingProject ? "Edit Real Estate Project" : "Create New Real Estate Project"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {editingProject ? `Modifying Project #${editingProject.id}` : "Add a promotional complex or construction project"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ProjectForm
          initialData={editingProject}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
