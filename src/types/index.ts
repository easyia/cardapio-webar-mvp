export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  logo_url: string;
  cover_url: string;
  primary_color: string;
  phone?: string;
  address?: string;
  currency: string;
  tables_count: number;
  wifi_name?: string;
  wifi_password?: string;
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon?: string;
  order_index: number;
}

export interface Dish {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  model_3d_url: string;
  usdz_url?: string;
  ar_ready?: boolean;
  is_active: boolean;
  is_featured?: boolean;
  is_chef_special?: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_gluten_free?: boolean;
  preparation_time?: string;
  calories?: number;
  rating?: number;
  reviews_count?: number;
  ingredients?: string[];
  portion_size?: string;
  created_at: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface TableOrder {
  id: string;
  table_number: string;
  items: CartItem[];
  total: number;
  status: 'enviado' | 'em_preparo' | 'entregue';
  created_at: string;
}
