import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, AlertCircle, ArrowUpRight, UserPlus, Building2, Briefcase } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "property" | "project" | "user" | "lead" | string;
  message: string;
  time: string;
  status: "pending" | "success" | "info" | string;
}

interface OverviewRecentActivitiesListProps {
  activities?: ActivityItem[];
}

export const OverviewRecentActivitiesList: React.FC<OverviewRecentActivitiesListProps> = ({
  activities = [],
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "property":
        return <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "project":
        return <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />;
      case "user":
        return <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "property":
        return "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30";
      case "project":
        return "bg-violet-50 dark:bg-violet-950/40 border-violet-100 dark:border-violet-900/30";
      case "user":
        return "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30";
      default:
        return "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
          <Activity className="h-4.5 w-4.5 text-yashomePink" />
          Live Platform Activity
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Real-time operations, listings, and development complexes.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pr-2 pb-6">
        {!activities || activities.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No recent activities recorded.
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border/80 ml-3 space-y-6 mt-2">
            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                {/* Timeline Dot with Icon */}
                <div
                  className={`absolute -left-[39px] top-0 h-7 w-7 rounded-full border flex items-center justify-center shadow-xxs ${getBgColor(
                    activity.type
                  )}`}
                >
                  {getIcon(activity.type)}
                </div>

                {/* Activity Detail */}
                <div className="flex flex-col gap-1 pl-2">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {activity.message}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      {activity.time}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        activity.status === "success"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30"
                          : "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/30"
                      }`}
                    >
                      {activity.status === "success" ? (
                        <>
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <Activity className="h-2.5 w-2.5" />
                          <span>Created</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
