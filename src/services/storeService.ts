import type { Restaurant, Category, Dish, TableOrder } from '../types';
import { INITIAL_RESTAURANT, INITIAL_CATEGORIES, INITIAL_DISHES } from '../data/mockData';

const RESTAURANT_KEY = 'auramenu_restaurant_v1';
const CATEGORIES_KEY = 'auramenu_categories_v1';
const DISHES_KEY = 'auramenu_dishes_v1';
const ORDERS_KEY = 'auramenu_orders_v1';
const AR_STATS_KEY = 'auramenu_ar_views_v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach(l => l());
}

export const storeService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Restaurant Profile
  getRestaurant(): Restaurant {
    const saved = localStorage.getItem(RESTAURANT_KEY);
    if (!saved) {
      localStorage.setItem(RESTAURANT_KEY, JSON.stringify(INITIAL_RESTAURANT));
      return INITIAL_RESTAURANT;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_RESTAURANT;
    }
  },

  saveRestaurant(restaurant: Restaurant): void {
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(restaurant));
    notifyListeners();
  },

  // Categories
  getCategories(): Category[] {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (!saved) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    notifyListeners();
  },

  addCategory(name: string, icon = '🍽️'): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      restaurant_id: this.getRestaurant().id,
      name,
      icon,
      order_index: categories.length,
    };
    categories.push(newCat);
    this.saveCategories(categories);
    return newCat;
  },

  deleteCategory(categoryId: string): void {
    let categories = this.getCategories();
    categories = categories.filter(c => c.id !== categoryId);
    this.saveCategories(categories);
  },

  // Dishes
  getDishes(): Dish[] {
    const saved = localStorage.getItem(DISHES_KEY);
    if (!saved) {
      localStorage.setItem(DISHES_KEY, JSON.stringify(INITIAL_DISHES));
      return INITIAL_DISHES;
    }
    try {
      const parsed: Dish[] = JSON.parse(saved);
      return parsed.map(d => ({
        ...d,
        scale: d.scale || 0.35,
      }));
    } catch {
      return INITIAL_DISHES;
    }
  },

  saveDishes(dishes: Dish[]): void {
    localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
    notifyListeners();
  },

  addDish(dishData: Omit<Dish, 'id' | 'created_at'>): Dish {
    const dishes = this.getDishes();
    const newDish: Dish = {
      ...dishData,
      id: `dish-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    dishes.unshift(newDish);
    this.saveDishes(dishes);
    return newDish;
  },

  updateDish(dishId: string, updates: Partial<Dish>): Dish | null {
    const dishes = this.getDishes();
    const index = dishes.findIndex(d => d.id === dishId);
    if (index === -1) return null;
    dishes[index] = { ...dishes[index], ...updates };
    this.saveDishes(dishes);
    return dishes[index];
  },

  toggleDishActive(dishId: string): boolean {
    const dishes = this.getDishes();
    const index = dishes.findIndex(d => d.id === dishId);
    if (index === -1) return false;
    dishes[index].is_active = !dishes[index].is_active;
    this.saveDishes(dishes);
    return dishes[index].is_active;
  },

  deleteDish(dishId: string): void {
    let dishes = this.getDishes();
    dishes = dishes.filter(d => d.id !== dishId);
    this.saveDishes(dishes);
  },

  // AR Metrics
  incrementARView(dishId: string): void {
    const saved = localStorage.getItem(AR_STATS_KEY);
    const stats: Record<string, number> = saved ? JSON.parse(saved) : {};
    stats[dishId] = (stats[dishId] || 0) + 1;
    stats['total'] = (stats['total'] || 0) + 1;
    localStorage.setItem(AR_STATS_KEY, JSON.stringify(stats));
    notifyListeners();
  },

  getARStats(): { total: number; byDish: Record<string, number> } {
    const saved = localStorage.getItem(AR_STATS_KEY);
    if (!saved) return { total: 42, byDish: { 'dish-01': 28, 'dish-03': 14 } };
    const stats: Record<string, number> = JSON.parse(saved);
    const total = stats['total'] || 42;
    return { total, byDish: stats };
  },

  // Orders
  getOrders(): TableOrder[] {
    const saved = localStorage.getItem(ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  createOrder(order: TableOrder): void {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    notifyListeners();
  },

  // Reset to default
  resetToDefaults(): void {
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(INITIAL_RESTAURANT));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(DISHES_KEY, JSON.stringify(INITIAL_DISHES));
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(AR_STATS_KEY);
    notifyListeners();
  }
};
