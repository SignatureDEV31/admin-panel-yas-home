import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Smartphone,
  Globe,
  Contact,
  HardHat,
  Target,
  CheckCircle2,
  Clock,
  Coins,
  Activity,
} from "lucide-react";
import { AdminDashboardStats } from "@/services/types/admin.types";

interface OverviewPlatformStatusProps {
  stats?: AdminDashboardStats | null;
  formatNumber: (num: number) => string;
}

export const OverviewPlatformStatus: React.FC<OverviewPlatformStatusProps> = ({
  stats,
  formatNumber,
}) => {
  const totalAgents = stats?.users?.agency ?? 0;
  const totalDevelopers = stats?.users?.promoter ?? 0;
  const publishedListings = stats?.properties?.active ?? 0;
  const pendingPublications = stats?.projects?.unpublished ?? 0;
  const generatedLeads = stats?.requests?.total ?? 0;
  const totalVisits = stats?.analytics?.totalVisits ?? 0;
  const uniqueVisitors = stats?.analytics?.uniqueVisitors ?? 0;
  const certifiedPromoters = stats?.users?.certified ?? 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
          <Activity className="h-4.5 w-4.5 text-yashomePink" />
          Platform Status & Operations
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Live channels traffic distribution and operational pipelines from backend.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Column 1: User Channels & Actors */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
              Channels & Key Stakeholders
            </h3>

            {/* Total Visits */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Total Platform Visits</p>
                  <p className="text-[10px] text-muted-foreground">Aggregated page views across web & mobile</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(totalVisits)}
              </span>
            </div>

            {/* Unique Visitors */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Unique Visitors</p>
                  <p className="text-[10px] text-muted-foreground">Distinct IP audience reached</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(uniqueVisitors)}
              </span>
            </div>

            {/* Agencies / Agents */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <Contact className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Real Estate Agencies</p>
                  <p className="text-[10px] text-muted-foreground">Registered broker partners</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(totalAgents)}
              </span>
            </div>

            {/* Developers / Promoters */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <HardHat className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Promoters & Developers</p>
                  <p className="text-[10px] text-muted-foreground">
                    {certifiedPromoters > 0
                      ? `${certifiedPromoters} verified certified profiles`
                      : "Development companies"}
                  </p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(totalDevelopers)}
              </span>
            </div>
          </div>

          {/* Column 2: Operations & Funnels */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
              Pipelines & Inventory
            </h3>

            {/* Generated Leads / Requests */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Buyer Inquiries & Needs</p>
                  <p className="text-[10px] text-muted-foreground">Customer demand and lead requests</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(generatedLeads)}
              </span>
            </div>

            {/* Active Property Listings */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Active Property Listings</p>
                  <p className="text-[10px] text-muted-foreground">Published real estate catalog</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(publishedListings)}
              </span>
            </div>

            {/* Unpublished / Moderation Projects */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Unpublished Projects</p>
                  <p className="text-[10px] text-muted-foreground">Projects awaiting review or draft</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber(pendingPublications)}
              </span>
            </div>

            {/* Featured Showcase */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                  <Coins className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Featured Showcase</p>
                  <p className="text-[10px] text-muted-foreground">
                    {stats?.marketing?.featuredProperties || 0} properties, {stats?.marketing?.featuredPromoters || 0} promoters
                  </p>
                </div>
              </div>
              <span className="text-base font-extrabold text-foreground">
                {formatNumber((stats?.marketing?.featuredProperties || 0) + (stats?.marketing?.featuredPromoters || 0))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
