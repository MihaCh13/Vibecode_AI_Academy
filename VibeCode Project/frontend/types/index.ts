export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ToolCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface RoleStats {
  total_tools: number;
  approved_tools: number;
  pending_tools: number;
  rejected_tools: number;
  role: string;
}

export interface AdminStats {
  total_tools: number;
  pending_tools: number;
  approved_tools: number;
  rejected_tools: number;
  total_categories: number;
  total_users: number;
}

export interface StatsResponse {
  success: boolean;
  stats: {
    role: string;
    role_display_name: string;
    tool_counts: ToolCounts;
    role_stats: RoleStats;
    categories: Category[];
  };
  cached: boolean;
  timestamp: string;
}

export interface AdminStatsResponse {
  success: boolean;
  stats: AdminStats;
  categories: Category[];
  cached: boolean;
  timestamp: string;
}

export interface CacheStats {
  categories_cached: boolean;
  category_counts_cached: boolean;
  tool_counts_cached: boolean;
  admin_stats_cached: boolean;
  role_stats_cached: boolean;
  [key: string]: boolean;
}

export interface CacheStatsResponse {
  success: boolean;
  cache_stats: CacheStats;
  cache_ttl: string;
  timestamp: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  target_type: string;
  target_id: number;
  old_values?: any;
  new_values?: any;
  ip_address: string;
  user_agent?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface AuditLogResponse {
  success: boolean;
  data: {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: any;
}

export interface AuditStats {
  total_logs: number;
  logs_today: number;
  logs_this_week: number;
  logs_this_month: number;
  actions_count: Record<string, number>;
  target_types_count: Record<string, number>;
  top_users: Array<{
    user: User;
    count: number;
  }>;
}

export interface AuditStatsResponse {
  success: boolean;
  stats: AuditStats;
}

export interface AuditFilterOptions {
  actions: Record<string, string>;
  target_types: Record<string, string>;
  users: User[];
  date_range: {
    earliest: string;
    latest: string;
  };
}

export interface AuditFilterOptionsResponse {
  success: boolean;
  options: AuditFilterOptions;
}

export interface TwoFactorAuth {
  has_two_factor: boolean;
  method: 'email' | 'telegram' | 'totp' | null;
  method_display_name: string | null;
  last_used_at: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
  role: string;
  role_display_name: string;
  requires_two_factor?: boolean;
  method?: 'email' | 'telegram' | 'totp';
  method_display_name?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  two_factor_code?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}

export interface Roles {
  [key: string]: string;
}

export const USER_ROLES = {
  owner: 'Owner (Admin)',
  backend: 'Backend Developer',
  frontend: 'Frontend Developer',
  pm: 'Product Manager',
  qa: 'QA Engineer',
  designer: 'Designer',
} as const;

export type UserRole = keyof typeof USER_ROLES;

// AI Tools Platform Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  category?: Category;
  tags?: Tag[];
  accessLevel?: string;
  usageCount?: number;
  lastUpdated?: string;
  isActive?: boolean;
  url?: string;
  documentation?: string;
  created_at: string;
  updated_at: string;
}