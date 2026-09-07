"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Project } from "@/services/projects/projects.service";
import { calculateProjectStats, ProjectStats } from "@/features/projects/utils/projects-utils";
import { getProjectStatItems } from "@/features/projects/data/data";

export interface ProjectsStatsProps {
  stats?: ProjectStats;
  projects?: Project[];
}

export function ProjectsStats({ stats: propStats, projects }: ProjectsStatsProps) {
  const stats = useMemo(() => {
    if (propStats) return propStats;
    return calculateProjectStats(projects || []);
  }, [propStats, projects]);

  const statItems = useMemo(() => getProjectStatItems(stats), [stats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </span>
              <Icon className="h-6 w-6 text-yashomePink shrink-0" />
            </CardHeader>
            <CardContent className="mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {item.value}
              </span>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
