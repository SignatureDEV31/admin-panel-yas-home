import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Users, Mail, Phone, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OverviewRecentActivityProps {
  recentUsers?: any[];
  getInitials: (name: string | null) => string;
  formatDate: (dateStr: string | null) => string;
}

export const OverviewRecentActivity: React.FC<OverviewRecentActivityProps> = ({
  recentUsers = [],
  getInitials,
  formatDate,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
          <Users className="h-4 w-4 text-yashomePink" />
          Recent Registrations
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Latest users, promoters, and agencies registered on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {!recentUsers || recentUsers.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No recent users registered in the system.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 border-border/50 text-xs font-semibold text-muted-foreground uppercase">
                <TableHead className="w-12 h-9 px-6 font-semibold">Avatar</TableHead>
                <TableHead className="h-9 px-6 font-semibold">Name / Company</TableHead>
                <TableHead className="h-9 px-6 font-semibold">Role</TableHead>
                <TableHead className="h-9 px-6 font-semibold">Contact</TableHead>
                <TableHead className="h-9 px-6 font-semibold text-right">Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
              {recentUsers.map((user, idx) => (
                <TableRow key={user.id || idx} className="hover:bg-muted/5 transition-colors border-border/40">
                  {/* Avatar */}
                  <TableCell className="px-6 py-3 font-medium align-middle">
                    <div className="h-9 w-9 rounded-full bg-main/5 dark:bg-main/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/50 uppercase select-none shadow-xxs">
                      {getInitials(user.fullName || user.profile?.raison_social)}
                    </div>
                  </TableCell>

                  {/* Name & Company */}
                  <TableCell className="px-6 py-3 font-semibold text-foreground text-sm leading-none">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5">
                        {user.fullName || "User"}
                        {user.profile?.certify && (
                          <span title="Certified Profile">
                            <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </span>
                      {user.profile?.raison_social && (
                        <span className="text-xs text-muted-foreground font-normal">
                          {user.profile.raison_social}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="px-6 py-3">
                    <Badge variant="outline" className="capitalize text-xs font-semibold">
                      {user.role || "Regular"}
                    </Badge>
                  </TableCell>

                  {/* Contact */}
                  <TableCell className="px-6 py-3 text-muted-foreground text-sm font-medium">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                        <span className="truncate max-w-[140px]">{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                          <Phone className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="px-6 py-3 text-right text-muted-foreground text-xs font-semibold">
                    {formatDate(user.createdAt)}
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
