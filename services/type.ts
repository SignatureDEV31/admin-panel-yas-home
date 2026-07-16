export interface PropertyByType {
  type: string; // "VENTE", "LOCATION"
  count: string | number;
}

export interface PropertiesByCity {
  city: string | null;
  count: string | number;
}

export interface UserRoleStat {
  role: string; // "promoter", "unknown", "regular", "admin", "agence"
  count: string | number;
}

export interface RecentPromoter {
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
}

export interface MonthlyUserGrowth {
  month: string; // ISO date string e.g. "2026-01-01T00:00:00.000Z"
  count: string | number;
}

export interface HourlyVisitStat {
  hour: number;
  count: number;
}

export interface DailyVisitStat {
  day: number;
  date: string;
  count: number;
}

export interface AdminStats {
  properties: number;
  projects: number;
  propertiesByType: PropertyByType[];
  propertiesByWilaya: PropertiesByCity[];
  monthlyUsers: MonthlyUserGrowth[];
  userStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    byRole: UserRoleStat[];
    promoters: {
      count: number;
      recent: RecentPromoter[];
    };
  };
  visitStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    todayByHour: HourlyVisitStat[];
    thisMonthByDay: DailyVisitStat[];
  };
}
