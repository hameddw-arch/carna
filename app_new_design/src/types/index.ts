// Core Domain Types

// Cars & Listings
export interface Car {
  id: string;
  title: string;
  make: string;
  model?: string;
  year: number;
  price: number;
  city: string;
  mileage: number;
  image?: string;
  body_type?: string;
  condition?: string;
  status?: string;
  user_id?: string;
  views?: number;
  created_at?: string;
  [key: string]: any; // For additional fields
}

export interface Listing extends Car {
  car_make?: string;
}

// Users
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  is_admin?: boolean;
  is_banned?: boolean;
  created_at?: string;
}

// Services/Workshops
export interface Service {
  id: string;
  name: string;
  user_type?: string;
  price?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface Workshop extends Service {
  title?: string;
  instructor_name?: string;
  date?: string;
  description?: string;
  status?: string;
  is_active?: boolean;
}

// Reviews & Ratings
export interface Review {
  id: string;
  reviewer_name?: string;
  listing_title?: string;
  rating?: number;
  comment?: string;
  created_at?: string;
}

// Transactions & Wallet
export interface Transaction {
  id: string;
  user_id?: string;
  amount?: number;
  type?: string;
  status?: string;
  created_at?: string;
}

// Admin Log
export interface AdminLog {
  id: number | string;
  action: string;
  type: string;
  color: string;
  icon: string;
  users?: { name: string };
  created_at?: string;
}

// System Settings
export interface SystemSetting {
  key?: string;
  value?: string;
  description?: string;
}

export interface Governorate {
  id?: string;
  name: string;
  is_active?: boolean;
  created_at?: string;
}

// Governorate Settings
export interface GovernorateSettings {
  id?: string;
  name: string;
  is_active?: boolean;
}

// Query Parameters & Filters
export interface ListingsFilter {
  condition?: string;
  tag?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  make?: string;
  [key: string]: any;
}

// UI Component Props
export interface TabContentProps {
  activityLogs?: AdminLog[];
  listings?: Listing[];
  pendingTxs?: Transaction[];
  stats?: any;
  services?: Service[];
  workshops?: Workshop[];
  reviews?: Review[];
  allUsers?: User[];
  pendingWorkshops?: Workshop[];
  systemSettings?: SystemSetting[];
  governorates?: Governorate[];
  userSearch?: string;
  newGovName?: string;
  [key: string]: any;
}

// Handlers
export type Handler = (...args: any[]) => void | Promise<void>;
export type AsyncHandler = (...args: any[]) => Promise<void>;

// API Response
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

// Common utility types
export type Maybe<T> = T | null | undefined;
export type Nullable<T> = T | null;
