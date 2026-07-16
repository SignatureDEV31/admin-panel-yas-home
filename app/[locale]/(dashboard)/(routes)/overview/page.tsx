"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  TrendingUp,
  Building2,
  Briefcase,
  AlertCircle,
  RotateCw,
  BarChart3,
  CalendarDays,
  Clock,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { getAdminStats, AdminStats } from "@/services/admin.service";

// Recharts imports
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

// Colors for Donut and Pie Charts
const CHART_COLORS = {
  yashomePink: "#FF014F",
  main: "#151533",
  indigo: "#6366f1",
  emerald: "#10b981",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#64748b"
};

// Helper to format numbers nicely (e.g. 1000 -> 1,000)
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Helper to format dates nicely
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  } catch {
    return "-";
  }
};

// Helper to get initials for Promoters Avatar
const getInitials = (name: string | null) => {
  if (!name || name.trim() === "") return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || "")
    .join("");
};

// Helper to normalize duplicate city/wilaya names (French/Arabic/Casing variants)
const normalizeCityName = (name: string): string => {
  const trimmed = name.trim().toLowerCase();
  
  // Normalization mapping for common variants
  const cityMap: Record<string, string> = {
    "alger": "Algiers",
    "algiers": "Algiers",
    "el djazair": "Algiers",
    "الجزائر": "Algiers",
    
    "oran": "Oran",
    "wahrane": "Oran",
    "وهران": "Oran",
    
    "constantine": "Constantine",
    "qacentina": "Constantine",
    "قسنطينة": "Constantine",
    
    "blida": "Blida",
    "البليدة": "Blida",
    
    "annaba": "Annaba",
    "عنابة": "Annaba",
    
    "setif": "Sétif",
    "sétif": "Sétif",
    "سطيف": "Sétif",
    
    "tizi ouzou": "Tizi Ouzou",
    "tizi-ouzou": "Tizi Ouzou",
    "تيزي وزو": "Tizi Ouzou",
    
    "bejaia": "Béjaïa",
    "béjaïa": "Béjaïa",
    "bgayet": "Béjaïa",
    "بجاية": "Béjaïa",
    
    "batna": "Batna",
    "باتنة": "Batna",
    
    "tlemcen": "Tlemcen",
    "تلمسان": "Tlemcen"
  };

  if (cityMap[trimmed]) {
    return cityMap[trimmed];
  }

  // Fallback: title case formatting
  return name
    .trim()
    .split(/[\s-_]+/)
    .map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
};

export default function OverviewPage() {
  const isMounted = useMounted();
  const t = useTranslations();
  const pageTitle = t ? t("overview") : "Overview";

  // Dashboard states
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitsTimeframe, setVisitsTimeframe] = useState<'today' | 'week' | 'month'>('month');

  // Fetch admin stats from the service
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getAdminStats();
      setData(stats);
    } catch (err: any) {
      console.error("Failed to load admin stats:", err);
      
      const base = err.config?.baseURL || "";
      const path = err.config?.url || "/admin/stats";
      const fullUrl = base ? (base.endsWith("/") && path.startsWith("/") ? `${base.slice(0, -1)}${path}` : `${base}${path}`) : path;
      
      const statusText = err.response ? `Status: ${err.response.status}` : "";
      const errorDetail = err.message || "Unknown error";
      
      setError(
        `Request to URL [${fullUrl}] failed. ${statusText ? `${statusText} - ` : ""}${errorDetail}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ----------------------------------------------------
  // Memoized calculations for clean, high-performance rendering
  // ----------------------------------------------------

  // KPI: Sum total users across all roles (Regular + Agency + Promoter + Admin + Unknown)
  const sumTotalUsers = useMemo(() => {
    if (!data?.userStats?.byRole) return 0;
    return data.userStats.byRole.reduce((sum, item) => sum + Number(item.count || 0), 0);
  }, [data]);

  // Section 1: Monthly User Growth
  const monthlyUsersData = useMemo(() => {
    if (!data?.monthlyUsers) return [];
    return data.monthlyUsers.map(item => {
      let monthName = "Unknown";
      try {
        const date = new Date(item.month);
        monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
      } catch {}
      return {
        Month: monthName,
        "Number of users": Number(item.count || 0)
      };
    });
  }, [data]);

  // Section 2: Property Distribution (Sale / Rent) Percentages
  const propertyDistribution = useMemo(() => {
    if (!data?.propertiesByType) return [];
    
    return data.propertiesByType.map(item => {
      const typeLabel = item.type === "VENTE" ? "Sale" : item.type === "LOCATION" ? "Rent" : item.type;
      return {
        name: typeLabel,
        value: Number(item.count || 0),
        fill: item.type === "VENTE" ? CHART_COLORS.yashomePink : CHART_COLORS.main
      };
    }).filter(item => ["sale", "rent"].includes(item.name.toLowerCase()));
  }, [data]);

  // Section 3: User Roles (Regular, Agency, Promoter, Admin, Unknown)
  const userRolesData = useMemo(() => {
    if (!data?.userStats?.byRole) return [];
    
    const roleMapping: Record<string, { label: string; fill: string }> = {
      regular: { label: "Regular", fill: CHART_COLORS.indigo },
      agence: { label: "Agency", fill: CHART_COLORS.blue },
      promoter: { label: "Promoter", fill: CHART_COLORS.violet },
      admin: { label: "Admin", fill: CHART_COLORS.emerald },
      unknown: { label: "Unknown", fill: CHART_COLORS.slate }
    };

    return data.userStats.byRole.map(item => {
      const roleKey = (item.role || "").toLowerCase().trim();
      const config = roleMapping[roleKey] || { label: item.role, fill: CHART_COLORS.slate };
      return {
        name: config.label,
        value: Number(item.count || 0),
        fill: config.fill
      };
    }).filter(item => item.value > 0);
  }, [data]);

  // Section 4: Top 10 Cities (Wilayas)
  const topWilayas = useMemo(() => {
    if (!data?.propertiesByWilaya) return [];
    
    const cityCounts: Record<string, number> = {};
    data.propertiesByWilaya.forEach(item => {
      // Ignore null, undefined, or empty values
      if (!item || !item.city || item.city.trim() === "") return;
      
      const normalized = normalizeCityName(item.city);
      cityCounts[normalized] = (cityCounts[normalized] || 0) + Number(item.count || 0);
    });

    return Object.entries(cityCounts)
      .map(([cityName, count]) => ({ name: cityName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  // Section 5: Visits This Month
  const visitsThisMonthData = useMemo(() => {
    if (!data?.visitStats?.thisMonthByDay) return [];
    return data.visitStats.thisMonthByDay.map(item => ({
      Day: String(item.day),
      Visits: item.count
    }));
  }, [data]);

  // Section 6: Today's Visits
  const todayVisitsData = useMemo(() => {
    if (!data?.visitStats?.todayByHour) return [];
    return data.visitStats.todayByHour.map(item => ({
      Hour: `${String(item.hour).padStart(2, "0")}:00`,
      Visits: item.count
    }));
  }, [data]);

  // ----------------------------------------------------
  // Custom Tooltip components for recharts
  // ----------------------------------------------------
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

  // Render Error boundary/state
  if (error) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
        </div>
        <div className="flex items-center justify-center min-h-[450px] w-full">
          <Card className="max-w-md w-full border-destructive/20 bg-destructive/5/10 dark:bg-destructive/5 shadow-xs">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground mb-2">Connection Error</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                {error}
              </CardDescription>
              <div className="flex gap-3 w-full justify-center">
                <Button variant="default" className="px-6 cursor-pointer w-full" onClick={fetchStats}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Loader/Skeletons State (prevents layout shifting)
  if (loading || !data) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>

        {/* 4 KPI Skeletons */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between h-[116px]">
              <div className="flex items-center justify-between pb-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </Card>
          ))}
        </div>

        {/* Chart Rows Skeletons */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="p-6">
              <div className="space-y-2 pb-6">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-64" />
              </div>
              <Skeleton className="h-[350px] w-full rounded-lg" />
            </Card>
          ))}
        </div>

        {/* Table Skeletons */}
        <Card className="overflow-hidden">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-56" />
          </CardHeader>
          <div className="p-6 pt-0 space-y-4">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 py-2 border-b border-border/40">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Users */}
        <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Total Users
            </span>
            <Users className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {formatNumber(sumTotalUsers)}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
              Sum of all registered platform roles
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Total Visits */}
        <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {visitsTimeframe === "today"
                ? "Total Visits (Today)"
                : visitsTimeframe === "week"
                ? "Total Visits (Week)"
                : "Total Visits (Month)"}
            </span>
            <TrendingUp className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1 flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground block">
                {formatNumber(
                  visitsTimeframe === "today"
                    ? (data.visitStats?.today || 0)
                    : visitsTimeframe === "week"
                    ? (data.visitStats?.thisWeek || 0)
                    : (data.visitStats?.thisMonth || 0)
                )}
              </span>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {visitsTimeframe === "today"
                  ? "Visitor traffic hits logged today"
                  : visitsTimeframe === "week"
                  ? "Traffic hits logged during this week"
                  : "Unique visitor hits logged this month"}
              </p>
            </div>
            
            {/* Timeframe Switcher */}
            <div className="flex rounded-lg border border-border bg-card overflow-hidden shadow-xs shrink-0 select-none">
              <button
                onClick={() => setVisitsTimeframe("today")}
                className={`h-7 w-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  visitsTimeframe === "today"
                    ? "bg-[#151533] text-white font-extrabold"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                T
              </button>
              <div className="w-[1px] bg-border h-7" />
              <button
                onClick={() => setVisitsTimeframe("week")}
                className={`h-7 w-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  visitsTimeframe === "week"
                    ? "bg-[#151533] text-white font-extrabold"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                W
              </button>
              <div className="w-[1px] bg-border h-7" />
              <button
                onClick={() => setVisitsTimeframe("month")}
                className={`h-7 w-8 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  visitsTimeframe === "month"
                    ? "bg-[#151533] text-white font-extrabold"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                M
              </button>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Total Properties */}
        <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Total Properties
            </span>
            <Building2 className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {formatNumber(data.properties)}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
              Registered assets in catalog
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Total Projects */}
        <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Total Projects
            </span>
            <Briefcase className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {formatNumber(data.projects)}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
              Active promotional projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS GRID (2 Columns on Desktop) */}
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
                  {/* Absolute Center Sum */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-foreground">
                      {formatNumber(propertyDistribution.reduce((acc, curr) => acc + curr.value, 0))}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold uppercase">Listings</span>
                  </div>
                </div>
                {/* Custom Legend */}
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
                {/* Legend list */}
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

      {/* SECTION 7: Recent Promoters Table */}
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
          {(!data.userStats?.promoters?.recent || data.userStats.promoters.recent.length === 0) ? (
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
                {data.userStats.promoters.recent.map((promoter, idx) => (
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
    </div>
  );
}

// Subcomponent: Minimalistic Empty state for charts
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