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
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  MapPin,
  Maximize2,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Property } from "@/features/properties/types/property";
import {
  formatPrice,
  formatSurface,
  getPropertyCategory,
  getPropertyLocation,
} from "@/features/properties/utils/properties-utils";

interface PropertiesTableProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
  sortField?: string | null;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  onSort,
}) => {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 group-hover/sort:opacity-100 transition-opacity shrink-0" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-yashomePink shrink-0 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-yashomePink shrink-0 font-bold" />
    );
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/10 border-border/50 text-xs font-bold text-muted-foreground uppercase select-none">
            <TableHead className="h-10 px-4 font-bold w-[20%]">
              <button
                type="button"
                onClick={() => onSort?.("title")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
              >
                <span>Property ID / Title</span>
                {renderSortIcon("title")}
              </button>
            </TableHead>
            <TableHead className="h-10 px-4 font-bold w-[20%]">
              <button
                type="button"
                onClick={() => onSort?.("propertyType")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
              >
                <span>Type</span>
                {renderSortIcon("propertyType")}
              </button>
            </TableHead>
            <TableHead className="h-10 px-4 font-bold w-[20%]">
              <button
                type="button"
                onClick={() => onSort?.("price")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
              >
                <span>Price</span>
                {renderSortIcon("price")}
              </button>
            </TableHead>
            <TableHead className="h-10 px-4 font-bold w-[14%] hidden md:table-cell">
              <button
                type="button"
                onClick={() => onSort?.("surface")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
              >
                <span>Surface</span>
                {renderSortIcon("surface")}
              </button>
            </TableHead>
            <TableHead className="h-10 px-4 font-bold w-[16%] hidden lg:table-cell">
              <button
                type="button"
                onClick={() => onSort?.("location")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer group/sort text-left font-bold uppercase"
              >
                <span>Location</span>
                {renderSortIcon("location")}
              </button>
            </TableHead>
            <TableHead className="h-10 px-4 font-bold w-[10%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40">
          {properties.map((property) => {
            const propertyId = property.id || property._id || "";
            const detailUrl = `/${locale}/properties/edit/${propertyId}`;
            const isSale = (property.propertyType || "").toUpperCase() === "VENTE";
            const categoryLabel = getPropertyCategory(property);
            const locationLabel = getPropertyLocation(property);

            // Extract main image or fallback
            const mainPhoto =
              typeof property.mainImage === "string"
                ? property.mainImage
                : property.mainImage?.url ||
                (property.images && property.images.length > 0
                  ? typeof property.images[0] === "string"
                    ? property.images[0]
                    : property.images[0].url
                  : null);

            return (
              <TableRow
                key={propertyId}
                className="hover:bg-muted/5 transition-colors border-border/40 group/row"
              >
                {/* Main Photo + ID + Title + Category */}
                <TableCell className="px-4 py-3.5 font-medium align-middle">
                  <div className="flex items-center gap-3">
                    {/* Clickable Photo Thumbnail */}
                    <Link
                      href={detailUrl}
                      className="shrink-0 hover:opacity-90 transition-opacity"
                    >
                      {mainPhoto ? (
                        <img
                          src={mainPhoto}
                          alt={`Property ${propertyId}`}
                          className="h-10 w-10 rounded-lg object-cover border border-border/80 shrink-0 shadow-xxs bg-muted"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-yashomePink/5 text-yashomePink flex items-center justify-center border border-yashomePink/10 shrink-0 shadow-xxs">
                          <Building2 className="h-5 w-5" />
                        </div>
                      )}
                    </Link>

                    {/* Clickable ID & Title */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={detailUrl}
                          className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-muted border border-border/80 text-foreground hover:bg-muted/80 transition-colors select-all shrink-0"
                        >
                          #{propertyId}
                        </Link>
                        {property.title && property.title.trim() !== "" && (
                          <Link
                            href={detailUrl}
                            className="text-xs text-foreground font-semibold hover:text-yashomePink transition-colors truncate max-w-[180px]"
                          >
                            {property.title.trim()}
                          </Link>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground/80 font-medium block">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Property Type (Vente / Location) */}
                <TableCell className="px-4 py-3.5 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${isSale
                        ? "bg-yashomePink/10 text-yashomePink border-yashomePink/20"
                        : "bg-main/10 text-main dark:text-foreground border-main/20"
                      }`}
                  >
                    {isSale ? "VENTE" : "LOCATION"}
                  </span>
                </TableCell>

                {/* Price */}
                <TableCell className="px-4 py-3.5 align-middle font-bold text-foreground text-sm">
                  <Link href={detailUrl} className="hover:text-yashomePink transition-colors">
                    {formatPrice(property.price)}
                  </Link>
                </TableCell>

                {/* Surface */}
                <TableCell className="px-4 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{formatSurface(property.surface)}</span>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell className="px-4 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="truncate max-w-[180px]">{locationLabel}</span>
                  </div>
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="px-4 py-3.5 text-right align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all select-none ml-auto">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                      <DropdownMenuItem className="cursor-pointer text-xs font-semibold flex items-center gap-1.5">
                        <Link href={detailUrl} className="flex items-center gap-1.5 w-full">
                          <ExternalLink className="h-3.5 w-3.5 text-yashomePink" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={() => onEdit(property)}
                          className="cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                          <span>Quick Edit</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(propertyId)}
                          className="cursor-pointer text-xs font-semibold flex items-center gap-1.5 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          <span>Delete</span>
                        </DropdownMenuItem>
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
  );
};
