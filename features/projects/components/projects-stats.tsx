import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Briefcase, Megaphone, HardHat, CheckCircle2 } from "lucide-react";
import { Project } from "@/services/projects/projects.service";
import { calculateProjectStats, ProjectStats } from "@/features/projects/utils/projects-utils";

interface ProjectsStatsProps {
  stats?: ProjectStats;
  projects?: Project[];
}

export const ProjectsStats: React.FC<ProjectsStatsProps> = ({ stats: propStats, projects }) => {
  const { total, announcement, underConstruction, finished } = useMemo(() => {
    if (propStats) return propStats;
    return calculateProjectStats(projects || []);
  }, [propStats, projects]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Projects */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total Projects
          </span>
          <Briefcase className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {total}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Active promotional development programs
          </p>
        </CardContent>
      </Card>

      {/* Announcement */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Announcements
          </span>
          <Megaphone className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {announcement}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Newly announced projects
          </p>
        </CardContent>
      </Card>

      {/* Under Construction */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Under Construction
          </span>
          <HardHat className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {underConstruction}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Developments currently in progress
          </p>
        </CardContent>
      </Card>

      {/* Finished */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Finished
          </span>
          <CheckCircle2 className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {finished}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Delivered & completed complexes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
