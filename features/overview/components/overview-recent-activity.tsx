import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Users, Mail, Phone } from "lucide-react";
import { RecentPromoter } from "@/services/types/admin.types";

interface OverviewRecentActivityProps {
  recentPromoters: RecentPromoter[];
  getInitials: (name: string | null) => string;
  formatDate: (dateStr: string | null) => string;
}

export const OverviewRecentActivity: React.FC<OverviewRecentActivityProps> = ({
  recentPromoters,
  getInitials,
  formatDate,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
          <Users className="h-4 w-4 text-yashomePink" />
          Recent Promoters
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Overview of recently registered developers and agencies.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {(!recentPromoters || recentPromoters.length === 0) ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No recent promoters registered in the system.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 border-border/50 text-xs font-semibold text-muted-foreground uppercase">
                <TableHead className="w-12 h-9 px-6 font-semibold">Avatar</TableHead>
                <TableHead className="h-9 px-6 font-semibold">Name</TableHead>
                <TableHead className="h-9 px-6 font-semibold">Email</TableHead>
                <TableHead className="h-9 px-6 font-semibold">Phone</TableHead>
                <TableHead className="h-9 px-6 font-semibold text-right">Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
              {recentPromoters.map((promoter, idx) => (
                <TableRow key={idx} className="hover:bg-muted/5 transition-colors border-border/40">
                  {/* Avatar */}
                  <TableCell className="px-6 py-3 font-medium align-middle">
                    <div className="h-9 w-9 rounded-full bg-main/5 dark:bg-main/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/50 uppercase select-none shadow-xxs">
                      {getInitials(promoter.fullName)}
                    </div>
                  </TableCell>
                  
                  {/* Name */}
                  <TableCell className="px-6 py-3 font-semibold text-foreground text-sm leading-none">
                    {promoter.fullName && promoter.fullName.trim() !== "" ? promoter.fullName : "Unknown"}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-6 py-3 text-muted-foreground text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span>{promoter.email}</span>
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="px-6 py-3 text-muted-foreground text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span>{promoter.phoneNumber && promoter.phoneNumber.trim() !== "" ? promoter.phoneNumber : "-"}</span>
                    </div>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="px-6 py-3 text-right text-muted-foreground text-sm font-semibold">
                    {formatDate(promoter.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
