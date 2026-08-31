import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Store, 
  Utensils, 
  ChevronRight, 
  Flame 
} from 'lucide-react';
import type { Restaurant, Category, Dish, CartItem } from './types';
import { storeService } from './services/storeService';

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

export function App() {
  // Navigation mode: 'client' | 'admin'
  const [viewMode, setViewMode] = useState<'client' | 'admin'>('client');
  const [adminTab, setAdminTab] = useState<AdminTab>('dishes');

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

  // Subscribe to storeService changes
  useEffect(() => {
    const unsubscribe = storeService.subscribe(() => {
      setRestaurant(storeService.getRestaurant());
      setCategories(storeService.getCategories());
      setDishes(storeService.getDishes());
    });
    return unsubscribe;
  }, []);

  // Parse URL search params (e.g. ?mesa=08, ?admin=true, ?dishId=dish-01&ar=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mesaParam = params.get('mesa');
    if (mesaParam) {
      setTableNumber(mesaParam);
    }
    const adminParam = params.get('admin');
    if (adminParam === 'true') {
      setViewMode('admin');
    }
    const dishIdParam = params.get('dishId');
    const arParam = params.get('ar');
    if (dishIdParam) {
      const foundDish = dishes.find(d => d.id === dishIdParam);
      if (foundDish) {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (arParam === 'true' && isMobile) {
          setLiveCameraDish(foundDish);
        } else {
          setSelectedDishDetail(foundDish);
        }
      }
    }
  }, [dishes]);

  // Handle AR projection trigger
  const handleTriggerAR = (dish: Dish) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // On mobile, open dish detail with 3D model & 1-tap native ARKit/SceneViewer
      setSelectedDishDetail(dish);
    } else {
      // On desktop, show QR code modal
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Top Demo Bar / Quick View Mode Switcher */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          {/* Status & Badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="font-extrabold text-orange-400 tracking-wide uppercase text-[11px] hidden xs:inline">
              AuraMenu WebAR MVP
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Demonstração Ativa sem necessidade de banco
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('client')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'client'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Visão Cliente</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'admin'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Painel Admin</span>
            </button>
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
            
            {/* Highlights Carousel / Banner (If selected 'all' and no active search) */}
            {selectedCategoryId === 'all' && !searchQuery && featuredDishes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-black text-white font-heading">
                      Destaques Imersivos em 3D
                    </h2>
                  </div>
                  <span className="text-xs text-orange-400 font-semibold">
                    Experiência WebAR
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
                          <Sparkles className="w-3 h-3 animate-pulse" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 inline-block mb-1">
                          ⭐ Destaque
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate font-heading">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {dish.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-black text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dish.price)}
                          </span>
                          <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Ver em 3D</span>
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
                    ? 'Cardápio Completo' 
                    : categories.find(c => c.id === selectedCategoryId)?.name || 'Pratos'}
                </h2>
                <span className="text-xs text-slate-400">
                  {filteredDishes.length} {filteredDishes.length === 1 ? 'opção' : 'opções'}
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
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Tente buscar por outro termo ou escolha outra categoria acima.
                  </p>
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
                      Mesa {tableNumber}
                    </span>
                    <span className="text-sm font-extrabold leading-tight">
                      Ver Comanda
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-black">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCartPrice)}
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

          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
            {adminTab === 'dishes' && (
              <DishesManager
                dishes={dishes}
                categories={categories}
                restaurantId={restaurant.id}
                onPreviewDish={(d) => setSelectedDishDetail(d)}
              />
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

            {adminTab === 'profile' && (
              <RestaurantProfile restaurant={restaurant} />
            )}
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODALS & POPUPS                                                        */}
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

      {/* Live Camera AR Surface Projector View (Works on ALL mobile devices) */}
      <LiveCameraARView
        dish={liveCameraDish}
        isOpen={Boolean(liveCameraDish)}
        onClose={() => setLiveCameraDish(null)}
      />

      {/* Cart Drawer & Order Simulator */}
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
