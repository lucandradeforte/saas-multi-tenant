export type UserRole = "admin" | "user";

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
  company?: Company;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string | null;
  status: "lead" | "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  companyId: string;
  totals: {
    users: number;
    admins: number;
    customers: number;
    activeCustomers: number;
  };
  growth: {
    newCustomersLast30Days: number;
  };
  report: {
    healthScore: number;
    customerConversionRate: number;
    highlights: string[];
    generatedAt: string;
  };
}
