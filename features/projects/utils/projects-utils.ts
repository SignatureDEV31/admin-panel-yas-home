import { Project as ProjectItem } from "@/services/projects/projects.service";

export interface ProjectStats {
  total: number;
  announcement: number;
  underConstruction: number;
  finished: number;
}

export const getProjectStatusBadge = (status?: string) => {
  const s = (status || "").toUpperCase().trim();
  if (s === "ANNOUNCEMENT" || s.includes("ANNOUNC")) {
    return { label: "Announcement", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
  }
  if (s === "UNDER_CONSTRUCTION" || s.includes("CONSTRUCT")) {
    return { label: "Under Construction", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
  }
  if (s === "FINISHED" || s.includes("FINISH")) {
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
    const rawQ = searchQuery.toLowerCase().trim();
    const q = rawQ.replace(/^#/, "");
    result = result.filter((p) => {
      const idStr = String(p.id || p._id || "").toLowerCase();
      const title = (p.title || p.propertyName || "").toLowerCase();
      const loc = (p.state || p.wilaya || p.city || p.address || p.adress || "").toLowerCase();
      return idStr.includes(q) || title.includes(q) || loc.includes(q);
    });
  }

  if (selectedStatus !== "all") {
    result = result.filter(
      (p) => ((p.status || p.projectStatus || "") as string).toUpperCase() === selectedStatus.toUpperCase()
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
    const s = ((p.status || p.projectStatus || "") as string).toUpperCase().trim();
    if (s === "ANNOUNCEMENT" || s.includes("ANNOUNC") || s.includes("LANCEMENT")) {
      announcement++;
    } else if (s === "FINISHED" || s.includes("FINISH") || s.includes("LIVR") || s.includes("COMPLET")) {
      finished++;
    } else if (s === "UNDER_CONSTRUCTION" || s.includes("CONSTRUCT") || s.includes("EN_COURS")) {
      underConstruction++;
    } else {
      underConstruction++;
    }
  });

  return {
    total,
    announcement,
    underConstruction,
    finished,
  };
};
