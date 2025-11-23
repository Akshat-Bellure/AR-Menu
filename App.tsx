import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { INITIAL_RESTAURANTS, INITIAL_USERS } from './data';
import { Restaurant, ViewState, Dish, Order } from './types';
import { Landing } from './views/Landing';
import { AdminDashboard } from './views/Admin';
import { CustomerMenu, ScanSimulator } from './views/Customer';

const App = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [registeredUsers] = useState(INITIAL_USERS);
  
  // Real-time Order State (Simulating Backend)
  const [orders, setOrders] = useState<Order[]>([]);

  const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId);

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setView('admin');
  };

  const handleScan = (id: string) => {
    const exists = restaurants.find(r => r.id === id);
    if (exists) {
      setActiveRestaurantId(id);
      setView('customer');
    } else {
        // Fallback for demo if scan ID doesn't match (usually shouldn't happen in this hardcoded demo)
        setActiveRestaurantId(restaurants[0].id);
        setView('customer');
    }
  };

  // --- Data Mutation Handlers ---

  const handleDishUpdate = (updatedDish: Dish) => {
    if (!activeRestaurant) return;
    
    const updatedMenu = activeRestaurant.menu.map(d => d.id === updatedDish.id ? updatedDish : d);
    const updatedRest = { ...activeRestaurant, menu: updatedMenu };
    
    setRestaurants(prev => 
      prev.map(r => r.id === activeRestaurant.id ? updatedRest : r)
    );
  };

  const handleDishDelete = (dishId: string) => {
    if (!activeRestaurant) return;
    
    const updatedMenu = activeRestaurant.menu.filter(d => d.id !== dishId);
    const updatedRest = { ...activeRestaurant, menu: updatedMenu };
    
    setRestaurants(prev => 
      prev.map(r => r.id === activeRestaurant.id ? updatedRest : r)
    );
  };

  const handlePlaceOrder = (order: Order) => {
      setOrders(prev => [order, ...prev]);
      // Simulate system notification
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <>
      {view === 'landing' && (
        <Landing 
            onSelectMode={(mode) => { if (mode === 'customer') setView('scanner'); }} 
            onLoginSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
        />
      )}

      {view === 'admin' && (
        <div className="min-h-screen bg-slate-950 p-4 md:p-6">
             <AdminDashboard 
                restaurants={restaurants} 
                onUpdateRestaurants={setRestaurants} 
                onPreview={(id) => { setActiveRestaurantId(id); setView('customer'); }} 
                currentUser={currentUser}
                onLogout={() => setView('landing')}
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
            />
        </div>
      )}

      {view === 'scanner' && (
        <ScanSimulator 
            onCancel={() => setView('landing')} 
            onScan={handleScan} 
        />
      )}

      {view === 'customer' && activeRestaurant && (
        <CustomerMenu 
            restaurant={activeRestaurant} 
            onBack={() => setView('landing')} 
            onDishUpdate={handleDishUpdate}
            onDishDelete={handleDishDelete}
            onPlaceOrder={handlePlaceOrder}
        />
      )}
    </>
  );
};

export default App;