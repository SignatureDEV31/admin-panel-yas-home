import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Building2,
  Briefcase,
  Smartphone,
  Globe,
  Contact,
  HardHat,
  Target,
  CheckCircle2,
  Clock,
  Coins,
  Activity
} from "lucide-react";
import { AdminStats } from "@/services/types/admin.types";

export interface MockMetrics {
  totalAgents: number;
  totalDevelopers: number;
  pendingPublications: number;
  publishedListings: number;
  pendingPayments: number;
  userAppUsers: number;
  userWebsiteUsers: number;
  generatedLeads: number;
}

interface OverviewKpiCardsProps {
  stats: AdminStats;
  sumTotalUsers: number;
  visitsTimeframe: 'today' | 'week' | 'month';
  setVisitsTimeframe: (timeframe: 'today' | 'week' | 'month') => void;
  formatNumber: (num: number) => string;
  mockMetrics: MockMetrics;
}

export const OverviewKpiCards: React.FC<OverviewKpiCardsProps> = ({
  stats,
  sumTotalUsers,
  visitsTimeframe,
  setVisitsTimeframe,
  formatNumber,
  mockMetrics,
}) => {
  const currentVisits =
    visitsTimeframe === 'today'
      ? stats.visitStats?.today || 0
      : visitsTimeframe === 'week'
      ? stats.visitStats?.thisWeek || 0
      : stats.visitStats?.thisMonth || 0;

  return (
    <div className="space-y-6">
      {/* 4 Core Performance Large Cards */}
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
              Total Visits
            </span>
            <TrendingUp className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {formatNumber(currentVisits)}
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setVisitsTimeframe('today')}
                className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  visitsTimeframe === 'today'
                    ? 'bg-main text-white'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setVisitsTimeframe('week')}
                className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  visitsTimeframe === 'week'
                    ? 'bg-main text-white'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setVisitsTimeframe('month')}
                className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  visitsTimeframe === 'month'
                    ? 'bg-main text-white'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                Month
              </button>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Total Properties */}
        <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Properties
            </span>
            <Building2 className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {formatNumber(stats.properties || 0)}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
              Active real estate listings on portal
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Total Projects */}
        <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Real Estate Projects
            </span>
            <Briefcase className="h-6 w-6 text-yashomePink shrink-0" />
          </CardHeader>
          <CardContent className="mt-1">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {formatNumber(stats.projects || 0)}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
              Promoter development complexes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Status & Operations Unified Compact Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Activity className="h-4.5 w-4.5 text-yashomePink" />
            Platform Status & Operations
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Channels traffic distribution and operational pipelines.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Column 1: User Channels & Actors */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
                Channels & Actors
              </h3>
              
              {/* User Website */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">User Website Users</p>
                    <p className="text-[10px] text-muted-foreground">Portal visitors via web browsers</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.userWebsiteUsers)}</span>
              </div>

              {/* User App */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">User App Users</p>
                    <p className="text-[10px] text-muted-foreground">Active mobile app sessions</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.userAppUsers)}</span>
              </div>

              {/* Agents */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <Contact className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Total Agents</p>
                    <p className="text-[10px] text-muted-foreground">Registered brokers & agencies</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.totalAgents)}</span>
              </div>

              {/* Developers */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <HardHat className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Total Developers</p>
                    <p className="text-[10px] text-muted-foreground">Active real estate promoters</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.totalDevelopers)}</span>
              </div>
            </div>

            {/* Column 2: Operations & Funnels */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
                Pipelines & Clearance
              </h3>
              
              {/* Generated Leads */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Generated Leads</p>
                    <p className="text-[10px] text-muted-foreground">Customer property inquiries</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.generatedLeads)}</span>
              </div>

              {/* Published Listings */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Published Listings</p>
                    <p className="text-[10px] text-muted-foreground">Live approved properties</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.publishedListings)}</span>
              </div>

              {/* Pending Publications */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Pending Publications</p>
                    <p className="text-[10px] text-muted-foreground">Awaiting moderator review</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.pendingPublications)}</span>
              </div>

              {/* Pending Payments */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Pending Payments</p>
                    <p className="text-[10px] text-muted-foreground">Plan renewals awaiting clearance</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-foreground">{formatNumber(mockMetrics.pendingPayments)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
