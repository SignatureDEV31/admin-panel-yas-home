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
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Amenity } from "@/features/amenities/types/amenity";
import { formatAmenityDate } from "@/features/amenities/utils/amenities-utils";
import { AmenityIcon } from "./amenity-icon";

interface AmenitiesTableProps {
  amenities: Amenity[];
  locale: string;
}

export const AmenitiesTable: React.FC<AmenitiesTableProps> = ({
  amenities,
  locale,
}) => {

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/10 border-border/50 text-xs font-bold text-muted-foreground uppercase">
            <TableHead className="h-10 px-6 font-bold w-[20%]">Amenity</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%]">System Key</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%]">Category</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%] hidden md:table-cell">Created</TableHead>
            <TableHead className="h-10 px-6 font-bold w-[20%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40">
          {amenities.map((amenity) => (
            <TableRow
              key={amenity.id}
              className="hover:bg-muted/5 transition-colors border-border/40 group/row"
            >
              {/* Amenity (Icon + Title + Category subtext on mobile) */}
              <TableCell className="px-6 py-3.5 font-medium align-middle">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-yashomePink/5 text-yashomePink flex items-center justify-center border border-yashomePink/10 shrink-0 shadow-xxs">
                    <AmenityIcon
                      amenityKey={amenity.key}
                      title={amenity.title}
                      category={amenity.category}
                      className="h-4.5 w-4.5"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block leading-tight">
                      {amenity.title && amenity.title.trim() !== ""
                        ? amenity.title.trim()
                        : "Untitled amenity"}
                    </span>
                    <span className="text-xxs text-muted-foreground/80 font-medium sm:hidden block mt-0.5">
                      {amenity.category && amenity.category.trim() !== ""
                        ? amenity.category.trim()
                        : "Uncategorized"}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Key */}
              <TableCell className="px-6 py-3.5 align-middle">
                <code className="text-xxs px-1.5 py-0.5 bg-muted border border-border/80 rounded-md font-mono text-muted-foreground select-all">
                  {amenity.key && amenity.key.trim() !== ""
                    ? amenity.key.trim()
                    : "missing_key"}
                </code>
              </TableCell>

              {/* Category */}
              <TableCell className="px-6 py-3.5 align-middle">
                <span className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {amenity.category && amenity.category.trim() !== ""
                    ? amenity.category.trim()
                    : "Uncategorized"}
                </span>
              </TableCell>

              {/* Created */}
              <TableCell className="px-6 py-3.5 text-muted-foreground text-sm font-medium align-middle hidden md:table-cell">
                {formatAmenityDate(amenity.createdAt, locale)}
              </TableCell>

              {/* Actions */}
              <TableCell className="px-6 py-3.5 pl-10 align-middle">
                <div className="inline-block text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all select-none">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36" align="end">
                      <DropdownMenuItem className="opacity-50 cursor-not-allowed text-xs font-semibold flex items-center gap-1.5">
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit (soon)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="opacity-50 cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete (soon)</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
