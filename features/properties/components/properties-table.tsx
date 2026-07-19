import React from "react";
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
import { Building2, MapPin, Maximize2, MoreVertical, Edit2, Trash2 } from "lucide-react";
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
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/10 border-border/50 text-xs font-bold text-muted-foreground uppercase">
            <TableHead className="h-10 px-6 font-bold w-[25%]">Property</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[15%]">Type</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%]">Price</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[15%] hidden md:table-cell">Surface</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[15%] hidden lg:table-cell">Location</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[10%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40">
          {properties.map((property) => {
            const propertyId = property.id || property._id || "";
            const isSale = (property.propertyType || "").toUpperCase() === "VENTE";
            const categoryLabel = getPropertyCategory(property);
            const locationLabel = getPropertyLocation(property);

            return (
              <TableRow
                key={propertyId}
                className="hover:bg-muted/5 transition-colors border-border/40 group/row"
              >
                {/* Title + Category */}
                <TableCell className="px-6 py-3.5 font-medium align-middle">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-yashomePink/5 text-yashomePink flex items-center justify-center border border-yashomePink/10 shrink-0 shadow-xxs">
                      <Building2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground block leading-tight">
                        {property.title && property.title.trim() !== ""
                          ? property.title.trim()
                          : "Untitled Listing"}
                      </span>
                      <span className="text-xs text-muted-foreground/80 font-medium block mt-0.5">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Property Type (Vente / Location) */}
                <TableCell className="px-6 py-3.5 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      isSale
                        ? "bg-yashomePink/10 text-yashomePink border-yashomePink/20"
                        : "bg-main/10 text-main dark:text-foreground border-main/20"
                    }`}
                  >
                    {isSale ? "VENTE" : "LOCATION"}
                  </span>
                </TableCell>

                {/* Price */}
                <TableCell className="px-6 py-3.5 align-middle font-bold text-foreground text-sm">
                  {formatPrice(property.price)}
                </TableCell>

                {/* Surface */}
                <TableCell className="px-6 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{formatSurface(property.surface)}</span>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell className="px-6 py-3.5 align-middle text-muted-foreground text-sm font-medium hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="truncate max-w-[180px]">{locationLabel}</span>
                  </div>
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="px-6 py-3.5 text-right align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all select-none ml-auto">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36" align="end">
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={() => onEdit(property)}
                          className="cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                          <span>Edit</span>
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
