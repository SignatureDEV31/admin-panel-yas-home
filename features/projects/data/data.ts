import { Briefcase, Megaphone, HardHat, CheckCircle2, LucideIcon } from "lucide-react";

export interface ProjectStatItem {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export interface ProjectStatsInput {
  total: number;
  announcement: number;
  underConstruction: number;
  finished: number;
}

export function getProjectStatItems(stats: ProjectStatsInput): ProjectStatItem[] {
  return [
    {
      title: "Total Projects",
      value: stats.total,
      description: "Active promotional development programs",
      icon: Briefcase,
    },
    {
      title: "Announcements",
      value: stats.announcement,
      description: "Newly announced projects",
      icon: Megaphone,
    },
    {
      title: "Under Construction",
      value: stats.underConstruction,
      description: "Developments currently in progress",
      icon: HardHat,
    },
    {
      title: "Finished",
      value: stats.finished,
      description: "Delivered & completed complexes",
      icon: CheckCircle2,
    },
  ];
}

export const projectStatusOptions = [
  { value: "all", label: "All Development Statuses" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "FINISHED", label: "Finished" },
];

export const projectPublishOptions = [
  { value: "all", label: "All Moderation" },
  { value: "published", label: "Published Online" },
  { value: "unpublished", label: "Unpublished / Draft" },
];
