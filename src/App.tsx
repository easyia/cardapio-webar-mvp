import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Store, 
  Utensils, 
  ChevronRight, 
  Flame,
  ChefHat,
  Home
} from 'lucide-react';
import type { Restaurant, Category, Dish, CartItem } from './types';
import { storeService } from './services/storeService';
import { i18n } from './services/i18n';
import type { Language } from './types/i18n';

// Landing Page
import { LandingPage } from './components/landing/LandingPage';

// Client components
import { Header } from './components/client/Header';
import { CategoryNav } from './components/client/CategoryNav';
import { DishCard } from './components/client/DishCard';
import { DishDetailModal } from './components/client/DishDetailModal';
import { CartDrawer } from './components/client/CartDrawer';
import { ARPromptModal } from './components/ar/ARPromptModal';
import { LiveCameraARView } from './components/ar/LiveCameraARView';

// Admin components
import { AdminHeader } from './components/admin/AdminHeader';
import type { AdminTab } from './components/admin/AdminHeader';
import { DishesManager } from './components/admin/DishesManager';
import { CategoriesManager } from './components/admin/CategoriesManager';
import { RestaurantProfile } from './components/admin/RestaurantProfile';
import { QRCodeGenerator } from './components/admin/QRCodeGenerator';
import { InsightsAnalytics } from './components/admin/InsightsAnalytics';
import { KitchenKDS } from './components/admin/KitchenKDS';
import { SubscriptionBilling } from './components/admin/SubscriptionBilling';

export function App() {
  // Navigation mode: 'landing' | 'client' | 'admin' | 'kds'
  const [viewMode, setViewMode] = useState<'landing' | 'client' | 'admin' | 'kds'>('landing');
  const [adminTab, setAdminTab] = useState<AdminTab>('dishes');

  // i18n Language State
  const [currentLang, setCurrentLang] = useState<Language>(i18n.getLanguage());

  // Reactive state from local storeService
  const [restaurant, setRestaurant] = useState<Restaurant>(storeService.getRestaurant());
  const [categories, setCategories] = useState<Category[]>(storeService.getCategories());
  const [dishes, setDishes] = useState<Dish[]>(storeService.getDishes());

  // Client menu states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('04');

  // Modals & Drawers
  const [selectedDishDetail, setSelectedDishDetail] = useState<Dish | null>(null);
  const [arPromptDish, setArPromptDish] = useState<Dish | null>(null);
  const [liveCameraDish, setLiveCameraDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Subscribe to storeService and i18n changes
  useEffect(() => {
    const unsubStore = storeService.subscribe(() => {
      setRestaurant(storeService.getRestaurant());
      setCategories(storeService.getCategories());
      setDishes(storeService.getDishes());
    });

    const unsubI18n = i18n.subscribe(() => {
      setCurrentLang(i18n.getLanguage());
    });

    return () => {
      unsubStore();
      unsubI18n();
    };
  }, []);

  // Parse URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mesaParam = params.get('mesa');
    if (mesaParam) {
      setTableNumber(mesaParam);
      setViewMode('client');
    }
    const modeParam = params.get('mode');
    if (modeParam === 'client' || modeParam === 'admin' || modeParam === 'kds' || modeParam === 'landing') {
      setViewMode(modeParam as any);
    }
    const adminParam = params.get('admin');
    if (adminParam === 'true') {
      setViewMode('admin');
    }
    const dishIdParam = params.get('dishId');
    if (dishIdParam) {
      const foundDish = dishes.find(d => d.id === dishIdParam);
      if (foundDish) {
        setViewMode('client');
        setSelectedDishDetail(foundDish);
      }
    }
  }, [dishes]);

  const handleLanguageChange = (lang: Language) => {
    i18n.setLanguage(lang);
    setCurrentLang(lang);
  };

  // Handle AR projection trigger
  const handleTriggerAR = (dish: Dish) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      setSelectedDishDetail(dish);
    } else {
      setArPromptDish(dish);
    }
  };

  // Handle Cart logic
  const handleAddToCart = (dish: Dish, quantity = 1, notes?: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.dish.id === dish.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (notes) updated[existingIdx].notes = notes;
        return updated;
      }
      return [...prev, { dish, quantity, notes }];
    });
  };

  const handleUpdateCartQuantity = (dishId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.dish.id === dishId ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (dishId: string) => {
    setCartItems(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  // Filter dishes for client view
  const activeDishes = dishes.filter(d => d.is_active);
  const filteredDishes = activeDishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.ingredients && dish.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategoryId === 'all' || dish.category_id === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  // Featured dishes for hero section
  const featuredDishes = activeDishes.filter(d => d.is_featured || d.is_chef_special);

  // Dishes count by category
  const dishesCountByCategory: Record<string, number> = {};
  activeDishes.forEach(d => {
    dishesCountByCategory[d.category_id] = (dishesCountByCategory[d.category_id] || 0) + 1;
  });

  const t = i18n.t();

  // =========================================================================
  // VIEW MODE: LANDING PAGE (SILICON VALLEY CONVERSION SITE)
  // =========================================================================
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <LandingPage
          onOpenClientDemo={() => setViewMode('client')}
          onOpenAdminDemo={() => setViewMode('admin')}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Top Demo Bar / Quick Navigation Switcher */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Status & Brand */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 font-extrabold text-orange-400 uppercase tracking-wide text-[11px] hover:text-orange-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>AuraMenu 3D</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              v2.0 Produção
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            
            <button
              onClick={() => setViewMode('landing')}
              className="px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all text-slate-400 hover:text-slate-200"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.landingView}</span>
            </button>

            <button
              onClick={() => setViewMode('client')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                viewMode === 'client' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.clientView}</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                viewMode === 'admin' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t.adminView}</span>
            </button>

            <button
              onClick={() => setViewMode('kds')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                viewMode === 'kds' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>{t.kdsView}</span>
            </button>

            {/* Language Switcher */}
            <div className="pl-1 border-l border-slate-800 flex items-center gap-1">
              <button
                onClick={() => handleLanguageChange(currentLang === 'pt-BR' ? 'es-AR' : 'pt-BR')}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1"
                title="Mudar Idioma"
              >
                <span>{currentLang === 'pt-BR' ? '🇧🇷 PT' : '🇦🇷 ES'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CLIENT VIEW (DIGITAL WEBAR MENU)                                       */}
      {/* ========================================================================= */}
      {viewMode === 'client' && (
        <div className="flex-1 flex flex-col pb-28">
          {/* Header */}
          <Header
            restaurant={restaurant}
            tableNumber={tableNumber}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={totalCartCount}
          />

          {/* Category Sticky Navigation */}
          <CategoryNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            dishesCountByCategory={dishesCountByCategory}
          />

          {/* Main Menu Content Area */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-8">
            
            {/* Highlights Carousel / Banner */}
            {selectedCategoryId === 'all' && !searchQuery && featuredDishes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-black text-white font-heading">
                      {t.featuredTitle}
                    </h2>
                  </div>
                  <span className="text-xs text-orange-400 font-semibold">
                    {t.featuredSubtitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredDishes.slice(0, 2).map((dish) => (
                    <div
                      key={`featured-${dish.id}`}
                      onClick={() => setSelectedDishDetail(dish)}
                      className="group relative rounded-3xl overflow-hidden border border-orange-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 shadow-xl hover:border-orange-500 transition-all cursor-pointer flex gap-4 items-center"
                    >
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-950">
                        <img
                          src={dish.image_url}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-1.5 left-1.5 p-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-orange-400">
                          <Flame className="w-3 h-3 animate-pulse" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 inline-block mb-1">
                          ⭐ {t.chefSpecial}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate font-heading">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {dish.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-black text-white">
                            {i18n.formatCurrency(dish.price)}
                          </span>
                          <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>{t.viewIn3D}</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white font-heading">
                  {selectedCategoryId === 'all' 
                    ? t.allCategories 
                    : categories.find(c => c.id === selectedCategoryId)?.name || 'Pratos'}
                </h2>
                <span className="text-xs text-slate-400">
                  {filteredDishes.length} {filteredDishes.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              {filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onOpenDetail={(d) => setSelectedDishDetail(d)}
                      onOpenAR={(d) => handleTriggerAR(d)}
                      onAddToCart={(d, e) => {
                        e.stopPropagation();
                        handleAddToCart(d, 1);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
                  <Utensils className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-base font-bold text-slate-200">Nenhum prato encontrado</p>
                </div>
              )}
            </div>

          </main>

          {/* Floating Bottom Cart Bar */}
          {totalCartCount > 0 && (
            <div className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto animate-bounce-subtle">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold rounded-2xl shadow-2xl shadow-orange-500/40 flex items-center justify-between border border-orange-400/40 transition-all transform active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-sm font-black">
                    {totalCartCount}
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-orange-100 block font-normal leading-none">
                      {t.tableNumberLabel} {tableNumber}
                    </span>
                    <span className="text-sm font-extrabold leading-tight">
                      {t.myOrder}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-black">
                    {i18n.formatCurrency(totalCartPrice)}
                  </span>
                  <ChevronRight className="w-5 h-5 opacity-80" />
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN DASHBOARD VIEW                                                   */}
      {/* ========================================================================= */}
      {viewMode === 'admin' && (
        <div className="flex-1 flex flex-col pb-16">
          <AdminHeader
            restaurant={restaurant}
            activeTab={adminTab}
            onTabChange={setAdminTab}
            onSwitchToClient={() => setViewMode('client')}
            dishesCount={activeDishes.length}
            categoriesCount={categories.length}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
            {adminTab === 'dishes' && (
              <DishesManager
                dishes={dishes}
                categories={categories}
                restaurantId={restaurant.id}
                onPreviewDish={(d) => setSelectedDishDetail(d)}
              />
            )}

            {adminTab === 'kds' && (
              <KitchenKDS />
            )}

            {adminTab === 'insights' && (
              <InsightsAnalytics dishes={dishes} />
            )}

            {adminTab === 'categories' && (
              <CategoriesManager
                categories={categories}
                dishesCountByCategory={dishesCountByCategory}
              />
            )}

            {adminTab === 'qrcodes' && (
              <QRCodeGenerator restaurant={restaurant} />
            )}

            {adminTab === 'billing' && (
              <SubscriptionBilling dishes={dishes} />
            )}

            {adminTab === 'profile' && (
              <RestaurantProfile restaurant={restaurant} />
            )}
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. KITCHEN KDS VIEW (DEDICATED FULLSCREEN)                                */}
      {/* ========================================================================= */}
      {viewMode === 'kds' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
          <KitchenKDS />
        </main>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS & POPUPS                                                        */}
      {/* ========================================================================= */}
      
      {/* Dish Detail & 3D Interactive Modal */}
      <DishDetailModal
        dish={selectedDishDetail}
        isOpen={Boolean(selectedDishDetail)}
        onClose={() => setSelectedDishDetail(null)}
        onAddToCart={handleAddToCart}
        onOpenARPrompt={(dish) => handleTriggerAR(dish)}
      />

      {/* Desktop WebAR QR Code Prompt Modal */}
      <ARPromptModal
        dish={arPromptDish}
        isOpen={Boolean(arPromptDish)}
        onClose={() => setArPromptDish(null)}
        restaurantSlug={restaurant.slug}
      />

      {/* Live Camera AR Surface Projector View */}
      <LiveCameraARView
        dish={liveCameraDish}
        isOpen={Boolean(liveCameraDish)}
        onClose={() => setLiveCameraDish(null)}
      />

      {/* Cart Drawer with Silicon Valley Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        tableNumber={tableNumber}
        restaurant={restaurant}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

    </div>
  );
}

export default App;
