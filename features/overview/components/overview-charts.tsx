import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, CalendarDays, Clock, ArrowRight, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

import { CHART_COLORS } from "@/features/overview/utils/overview-utils";

interface OverviewChartsProps {
  isMounted: boolean;
  monthlyUsersData: any[];
  propertyDistribution: any[];
  userRolesData: any[];
  topWilayas: any[];
  visitsThisMonthData: any[];
  todayVisitsData: any[];
  sumTotalUsers: number;
  formatNumber: (num: number) => string;
}

export const OverviewCharts: React.FC<OverviewChartsProps> = ({
  isMounted,
  monthlyUsersData,
  propertyDistribution,
  userRolesData,
  topWilayas,
  visitsThisMonthData,
  todayVisitsData,
  sumTotalUsers,
  formatNumber,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 border border-border/80 p-3 rounded-lg shadow-md backdrop-blur-xs text-xs">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span>{item.name}:</span>
              <span className="font-bold text-foreground">{formatNumber(item.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percent = payload[0].percent !== undefined ? (payload[0].percent * 100).toFixed(1) : null;
      return (
        <div className="bg-card/95 border border-border/80 p-3 rounded-lg shadow-md backdrop-blur-xs text-xs">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill || payload[0].color }} />
            {item.name}
          </p>
          <p className="text-muted-foreground flex flex-col gap-0.5">
            <span>Count: <span className="font-bold text-foreground">{formatNumber(item.value)}</span></span>
            {percent !== null && <span>Percentage: <span className="font-bold text-foreground">{percent}%</span></span>}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* SECTION 1: Monthly User Growth */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Users className="h-4 w-4 text-yashomePink" />
            Monthly User Growth
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Accumulated user registrations tracked per month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(!monthlyUsersData || monthlyUsersData.length === 0) ? (
            <EmptyStateChart message="No user growth records found." />
          ) : isMounted ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis dataKey="Month" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Number of users"
                    name="Users"
                    stroke={CHART_COLORS.yashomePink}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 0, fill: CHART_COLORS.yashomePink }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] w-full bg-muted/10 rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: Property Distribution (Donut Chart) */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Building2 className="h-4 w-4 text-yashomePink" />
            Property Distribution
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Proportion of real estate listings for sale vs rent.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          {propertyDistribution.length === 0 ? (
            <EmptyStateChart message="No listings available." />
          ) : isMounted ? (
            <div className="flex flex-col sm:flex-row items-center w-full justify-around gap-4 h-[350px]">
              <div className="h-60 w-60 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={propertyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      isAnimationActive={true}
                    >
                      {propertyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-foreground">
                    {formatNumber(propertyDistribution.reduce((acc, curr) => acc + curr.value, 0))}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase">Listings</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 max-w-[150px] w-full">
                {propertyDistribution.map((item, idx) => {
                  const totalVal = propertyDistribution.reduce((acc, curr) => acc + curr.value, 0);
                  const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(0) : "0";
                  return (
                    <div key={idx} className="flex items-center justify-between text-sm w-full">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="text-muted-foreground font-medium">{item.name}</span>
                      </div>
                      <span className="font-semibold text-foreground ml-3">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-[350px] w-full bg-muted/10 rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: User Roles (Donut Chart) */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Users className="h-4 w-4 text-yashomePink" />
            User Roles Breakdown
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Distribution of roles among registered user profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          {userRolesData.length === 0 ? (
            <EmptyStateChart message="No user role records found." />
          ) : isMounted ? (
            <div className="flex flex-col sm:flex-row items-center w-full justify-around gap-4 h-[350px]">
              <div className="h-60 w-60 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={userRolesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={true}
                    >
                      {userRolesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-foreground">{formatNumber(sumTotalUsers)}</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase">Users</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 max-w-[150px] w-full">
                {userRolesData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm w-full">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                      <span className="text-muted-foreground font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground ml-3">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[350px] w-full bg-muted/10 rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* SECTION 4: Top Cities (Horizontal Bar Chart) */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Building2 className="h-4 w-4 text-yashomePink" />
                Top Cities
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Active properties cataloged per normalized Wilaya/City.
              </CardDescription>
            </div>
            <Button variant="outline" size="xs" className="cursor-pointer border-border font-medium flex items-center gap-1 bg-card text-xxs hover:text-foreground/90 py-0 h-6">
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {topWilayas.length === 0 ? (
            <EmptyStateChart message="No properties location data available." />
          ) : isMounted ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topWilayas}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Properties"
                    fill={CHART_COLORS.yashomePink}
                    radius={[0, 4, 4, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] w-full bg-muted/10 rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* SECTION 5: Visits This Month (Line Chart) */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <CalendarDays className="h-4 w-4 text-yashomePink" />
            Visits This Month
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Daily traffic activity tracking over the current month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(!visitsThisMonthData || visitsThisMonthData.length === 0) ? (
            <EmptyStateChart message="No traffic logs registered this month." />
          ) : isMounted ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitsThisMonthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis dataKey="Day" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Visits"
                    name="Visits"
                    stroke={CHART_COLORS.yashomePink}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] w-full bg-muted/10 rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>

      {/* SECTION 6: Today's Visits (Area Chart) */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Clock className="h-4 w-4 text-yashomePink" />
            Today's Visits
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Hourly real-time visitor logs on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(!todayVisitsData || todayVisitsData.length === 0) ? (
            <EmptyStateChart message="No visitor logs recorded today yet." />
          ) : isMounted ? (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={todayVisitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.yashomePink} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={CHART_COLORS.yashomePink} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                  <XAxis dataKey="Hour" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Visits"
                    name="Visits"
                    stroke={CHART_COLORS.yashomePink}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[350px] w-full bg-muted/10 rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function EmptyStateChart({ message }: { message: string }) {
  return (
    <div className="h-[350px] w-full flex flex-col items-center justify-center bg-muted/5 rounded-lg border border-dashed border-border/60 p-6">
      <div className="h-10 w-10 rounded-full bg-muted/10 flex items-center justify-center mb-3">
        <BarChart3 className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground font-semibold text-center max-w-xs">{message}</p>
    </div>
  );
}
