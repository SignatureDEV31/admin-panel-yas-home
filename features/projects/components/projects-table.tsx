import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Briefcase, MapPin, Maximize2 } from "lucide-react";
import { Property as ProjectItem } from "@/services/properties/properties.service";
import {
  formatPrice,
  formatSurface,
  getPropertyLocation,
} from "@/features/properties/utils/properties-utils";
import { getProjectStatusBadge } from "@/features/projects/utils/projects-utils";

interface ProjectsTableProps {
  projects: ProjectItem[];
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/10 border-border/50 text-xs font-bold text-muted-foreground uppercase">
            <TableHead className="h-10 px-6 font-bold w-[30%]">Project Name</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%]">Status</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%]">Starting Price</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[15%] hidden md:table-cell">Surface</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[15%] hidden lg:table-cell">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40">
          {projects.map((project) => {
            const statusBadge = getProjectStatusBadge(project.projectStatus);
            const locationLabel = getPropertyLocation(project);

            return (
              <TableRow
                key={project.id || project._id}
                className="hover:bg-muted/5 transition-colors border-border/40 group/row"
              >
                {/* Title */}
                <TableCell className="px-6 py-3.5 font-medium align-middle">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-yashomePink/5 text-yashomePink flex items-center justify-center border border-yashomePink/10 shrink-0 shadow-xxs">
                      <Briefcase className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground block leading-tight">
                        {project.title && project.title.trim() !== ""
                          ? project.title.trim()
                          : "Promotional Complex"}
                      </span>
                      <span className="text-xs text-muted-foreground/80 font-medium block mt-0.5">
                        {project.typeVendeur || "Real Estate Promoter"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="px-6 py-3.5 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusBadge.color}`}
                  >
                    {statusBadge.label}
                  </span>
                </TableCell>

                {/* Price */}
                <TableCell className="px-6 py-3.5 align-middle font-bold text-foreground text-sm">
                  {formatPrice(project.price)}
                </TableCell>

                {/* Surface */}
                <TableCell className="px-6 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{formatSurface(project.surface)}</span>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell className="px-6 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="truncate max-w-[180px]">{locationLabel}</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
