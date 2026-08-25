import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  MapPin,
  Maximize2,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/services/projects/projects.service";
import {
  formatPrice,
  formatSurface,
  getPropertyLocation,
} from "@/features/properties/utils/properties-utils";
import { getProjectStatusBadge } from "@/features/projects/utils/projects-utils";
import { AdminBulkActionType } from "@/services/types/admin.types";

interface ProjectsTableProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onTogglePublish?: (project: Project) => void;
  sortField?: string | null;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  // Bulk selection props
  selectedIds?: (string | number)[];
  onSelectAll?: (checked: boolean) => void;
  onSelectProject?: (id: string | number, checked: boolean) => void;
  onBulkAction?: (action: AdminBulkActionType) => void;
  isBulkActing?: boolean;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onEdit,
  onDelete,
  onTogglePublish,
  sortField,
  sortOrder,
  onSort,
  selectedIds = [],
  onSelectAll,
  onSelectProject,
  onBulkAction,
  isBulkActing = false,
}) => {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const allSelected = projects.length > 0 && selectedIds.length === projects.length;
  const isSomeSelected = selectedIds.length > 0 && !allSelected;

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="h-3 w-3 opacity-40 group-hover/sort:opacity-100 transition-opacity shrink-0" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-yashomePink shrink-0 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-yashomePink shrink-0 font-bold" />
    );
  };

  return (
    <div className="space-y-3">
      {/* Floating / Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && onBulkAction && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>{selectedIds.length} projects selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Publish */}
            <Button
              size="sm"
              variant="outline"
              disabled={isBulkActing}
              onClick={() => onBulkAction(AdminBulkActionType.PUBLISH)}
              className="h-8 text-xs font-semibold cursor-pointer border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
            >
              <Globe className="h-3.5 w-3.5 mr-1" />
              Publish Online
            </Button>

            {/* Bulk Unpublish */}
            <Button
              size="sm"
              variant="outline"
              disabled={isBulkActing}
              onClick={() => onBulkAction(AdminBulkActionType.UNPUBLISH)}
              className="h-8 text-xs font-semibold cursor-pointer border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            >
              <EyeOff className="h-3.5 w-3.5 mr-1" />
              Unpublish / Draft
            </Button>

            {/* Bulk Delete */}
            <Button
              size="sm"
              variant="destructive"
              disabled={isBulkActing}
              onClick={() => onBulkAction(AdminBulkActionType.DELETE)}
              className="h-8 text-xs font-semibold cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 border-border/50 text-xs font-bold text-muted-foreground uppercase select-none">
              {/* Checkbox All */}
              {onSelectAll && (
                <TableHead className="h-10 pl-4 pr-1 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </TableHead>
              )}

              <TableHead className="h-10 px-4 font-bold">
                <button
                  type="button"
                  onClick={() => onSort?.("title")}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
                >
                  <span>Project ID / Name</span>
                  {renderSortIcon("title")}
                </button>
              </TableHead>

              <TableHead className="h-10 px-4 font-bold">
                <button
                  type="button"
                  onClick={() => onSort?.("status")}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
                >
                  <span>Status</span>
                  {renderSortIcon("status")}
                </button>
              </TableHead>

              <TableHead className="h-10 px-4 font-bold">
                Moderation
              </TableHead>

              <TableHead className="h-10 px-4 font-bold">
                <button
                  type="button"
                  onClick={() => onSort?.("price")}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
                >
                  <span>Starting Price</span>
                  {renderSortIcon("price")}
                </button>
              </TableHead>

              <TableHead className="h-10 px-4 font-bold hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => onSort?.("surface")}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
                >
                  <span>Surface</span>
                  {renderSortIcon("surface")}
                </button>
              </TableHead>

              <TableHead className="h-10 px-4 font-bold hidden lg:table-cell">
                <button
                  type="button"
                  onClick={() => onSort?.("location")}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
                >
                  <span>Location</span>
                  {renderSortIcon("location")}
                </button>
              </TableHead>

              <TableHead className="h-10 px-4 font-bold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {projects.map((project) => {
              const projectId = String(project.id || project._id || "");
              const isSelected = selectedIds.some((id) => String(id) === projectId);
              const detailUrl = `/${locale}/projects/${projectId}`;
              const statusBadge = getProjectStatusBadge(
                project.status || project.projectStatus
              );
              const locationLabel = getPropertyLocation(project);
              const isPublished = project.isPublished !== false;

              const mainPhoto =
                typeof project.mainImage === "string"
                  ? project.mainImage
                  : project.mainImage?.url ||
                    (project.images && project.images.length > 0
                      ? typeof project.images[0] === "string"
                        ? project.images[0]
                        : project.images[0].url
                      : null);

              return (
                <TableRow
                  key={projectId}
                  className={`hover:bg-muted/5 transition-colors border-border/40 group/row ${
                    isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  {onSelectProject && (
                    <TableCell className="pl-4 pr-1 align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectProject(projectId, e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                    </TableCell>
                  )}

                  {/* Photo + Project ID & Title */}
                  <TableCell className="px-4 py-3.5 font-medium align-middle">
                    <div className="flex items-center gap-3">
                      <Link
                        href={detailUrl}
                        className="shrink-0 hover:opacity-90 transition-opacity"
                      >
                        {mainPhoto ? (
                          <img
                            src={mainPhoto}
                            alt={`Project ${projectId}`}
                            className="h-10 w-10 rounded-lg object-cover border border-border/80 shrink-0 shadow-xxs bg-muted"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-yashomePink/5 text-yashomePink flex items-center justify-center border border-yashomePink/10 shrink-0 shadow-xxs">
                            <Briefcase className="h-5 w-5" />
                          </div>
                        )}
                      </Link>

                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={detailUrl}
                            className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-muted border border-border/80 text-foreground hover:bg-muted/80 transition-colors select-all shrink-0"
                          >
                            #{projectId}
                          </Link>
                          {(project.title || project.propertyName) && (
                            <Link
                              href={detailUrl}
                              className="text-xs text-foreground font-semibold hover:text-yashomePink transition-colors truncate max-w-[200px]"
                            >
                              {(project.title || project.propertyName || "").trim()}
                            </Link>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground/80 font-medium block">
                          {project.user?.profile?.raison_social ||
                            project.user?.fullName ||
                            (project as any).typeVendeur ||
                            "Real Estate Promoter"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="px-4 py-3.5 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusBadge.color}`}
                    >
                      {statusBadge.label}
                    </span>
                  </TableCell>

                  {/* Moderation Publish Switch */}
                  <TableCell className="px-4 py-3.5 align-middle">
                    {onTogglePublish ? (
                      <button
                        onClick={() => onTogglePublish(project)}
                        title={
                          isPublished
                            ? "Click to unpublish (set to draft)"
                            : "Click to publish live"
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                          isPublished
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <Globe className="h-3 w-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold">
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    )}
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-4 py-3.5 align-middle font-bold text-foreground text-sm">
                    <Link
                      href={detailUrl}
                      className="hover:text-yashomePink transition-colors"
                    >
                      {formatPrice(project.price || project.financementPrix)}
                    </Link>
                  </TableCell>

                  {/* Surface */}
                  <TableCell className="px-4 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span>{formatSurface(project.surface || project.surfaceMax)}</span>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell className="px-4 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="truncate max-w-[160px]">{locationLabel}</span>
                    </div>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="px-4 py-3.5 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all select-none ml-auto">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-44" align="end">
                        <DropdownMenuItem className="cursor-pointer text-xs font-semibold flex items-center gap-1.5">
                          <Link href={detailUrl} className="flex items-center gap-1.5 w-full">
                            <ExternalLink className="h-3.5 w-3.5 text-yashomePink" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit(project)}
                            className="cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                            <span>Quick Edit</span>
                          </DropdownMenuItem>
                        )}
                        {onTogglePublish && (
                          <DropdownMenuItem
                            onClick={() => onTogglePublish(project)}
                            className="cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                          >
                            {isPublished ? (
                              <>
                                <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Globe className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Publish</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(projectId)}
                              className="cursor-pointer text-xs font-semibold flex items-center gap-1.5 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
