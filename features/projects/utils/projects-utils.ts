import { Property as ProjectItem } from "@/services/properties/properties.service";

export interface ProjectStats {
  total: number;
  announcement: number;
  underConstruction: number;
  finished: number;
}

export const getProjectStatusBadge = (status?: string) => {
  const s = (status || "").toUpperCase().trim();
  if (s === "ANNOUNCEMENT" || s === "ANNOUNCE") {
    return { label: "Announcement", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
  }
  if (s === "UNDER_CONSTRUCTION" || s === "CONSTRUCTION") {
    return { label: "Under Construction", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
  }
  if (s === "FINISHED" || s === "COMPLETED") {
    return { label: "Finished", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
  }
  return { label: status || "Under Development", color: "bg-main/10 text-main dark:text-foreground border-main/20" };
};

export const filterProjects = (
  projects: ProjectItem[],
  searchQuery: string,
  selectedStatus: string
): ProjectItem[] => {
  if (!projects || !Array.isArray(projects)) return [];

  let result = [...projects];

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const loc = (p.state || p.wilaya || p.city || "").toLowerCase();
      return title.includes(q) || loc.includes(q);
    });
  }

  if (selectedStatus !== "all") {
    result = result.filter(
      (p) => (p.projectStatus || "").toUpperCase() === selectedStatus.toUpperCase()
    );
  }

  return result;
};

export const calculateProjectStats = (projects: ProjectItem[]): ProjectStats => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const total = safeProjects.length;
  let announcement = 0;
  let underConstruction = 0;
  let finished = 0;

  safeProjects.forEach((p) => {
    const s = (p.projectStatus || "").toUpperCase();
    if (s === "ANNOUNCEMENT") announcement++;
    else if (s === "UNDER_CONSTRUCTION") underConstruction++;
    else if (s === "FINISHED") finished++;
  });

  return {
    total,
    announcement,
    underConstruction,
    finished,
  };
};
