import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ShoppingBag, CheckCircle, Video, Box, X, 
  Camera, Flame, Leaf, ChevronRight, Star, Info, Box as BoxIcon, Edit3, Trash2, Lock, Unlock
} from 'lucide-react';
import { Restaurant, Dish, CartItem, Order } from '../types';
import { Button, Badge, Input } from '../components/UI';
import { DishVisualizer, MiniDishVisualizer, ARViewer } from '../components/ARComponents';
import { DishEditor } from './Admin';

interface CustomerMenuProps {
  restaurant: Restaurant;
  onBack: () => void;
  onDishUpdate?: (updatedDish: Dish) => void;
  onDishDelete?: (dishId: string) => void;
  onPlaceOrder?: (order: Order) => void;
}

export const ScanSimulator = ({ onScan, onCancel }: { onScan: (id: string) => void, onCancel: () => void }) => {
  useEffect(() => { const t = setTimeout(() => onScan("rest-paradise"), 2200); return () => clearTimeout(t); }, [onScan]);
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white overflow-hidden">
       <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1287')] bg-cover blur-sm" />
       <button onClick={onCancel} className="absolute top-8 right-8 p-3 bg-black/50 rounded-full z-50"><X size={24} /></button>
       <div className="relative z-10 flex flex-col items-center">
            <div className="w-72 h-72 border-[3px] border-orange-500/80 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.4)] bg-white/5 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent h-1/2 w-full animate-scan" />
                <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" size={48} />
            </div>
            <div className="mt-12 text-center space-y-2"><h2 className="text-2xl font-bold">Align QR Code</h2><p className="text-slate-400">Scanning menu...</p></div>
       </div>
    </div>
  );
};

export const CustomerMenu: React.FC<CustomerMenuProps> = ({ restaurant, onBack, onDishUpdate, onDishDelete, onPlaceOrder }) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [hoveredDishId, setHoveredDishId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Manager Mode State
  const [isManagerMode, setIsManagerMode] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [tableNo, setTableNo] = useState("1");

  const categories = ["All", ...Array.from(new Set(restaurant.menu.map(d => d.category)))];
  const filteredDishes = restaurant.menu.filter(d => activeCategory === "All" || d.category === activeCategory);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const toggleManagerMode = () => {
      if (isManagerMode) setIsManagerMode(false);
      else setShowPinPad(true);
  };

  const handlePinSubmit = (pin: string) => {
      if (pin === "1234") { setIsManagerMode(true); setShowPinPad(false); }
      else alert("Invalid PIN");
  };

  // --- Detail Modal ---
  const DetailModal = ({ dish, onClose }: { dish: Dish, onClose: () => void }) => {
    const [isAROpen, setIsAROpen] = useState(false);
    if (isAROpen) return <ARViewer dish={dish} onClose={() => setIsAROpen(false)} />;
    
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
        <div className="relative w-full max-w-4xl bg-slate-900 md:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh] border border-white/10 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/40 text-white p-2.5 rounded-full backdrop-blur-md"><X size={20} /></button>
          <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-8">
             <DishVisualizer dish={dish} interactive={true} />
             <div className="mt-8"><Button onClick={() => setIsAROpen(true)} className="bg-white/10 border border-white/20" icon={BoxIcon}>View in Room (AR)</Button></div>
          </div>
          <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-slate-900 custom-scrollbar">
            <div className="flex justify-between mb-2">
                <div><Badge color={dish.isVeg ? 'green' : 'red'}>{dish.category}</Badge><h2 className="text-3xl font-black text-white mt-2">{dish.name}</h2></div>
                <div className="text-right"><span className="block text-3xl font-light text-orange-500">₹{dish.price}</span></div>
            </div>
            <p className="text-slate-400 text-lg mb-6">{dish.description}</p>
            <div className="flex gap-2 mb-8">{dish.tags.map(t => <span key={t} className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-slate-300">{t}</span>)}</div>
            <div className="mt-8 pt-4 sticky bottom-0 bg-slate-900 space-y-3">
                <Button onClick={() => { setCart(prev => { const ex = prev.find(i => i.id === dish.id); if(ex) return prev.map(i => i.id === dish.id ? {...i, quantity: i.quantity+1} : i); return [...prev, {...dish, quantity:1}]; }); onClose(); }} className="w-full py-4 text-lg" icon={ShoppingBag}>Add to Order</Button>
                {isManagerMode && (
                    <div className="flex gap-2">
                        <Button onClick={() => setEditingDish(dish)} variant="secondary" className="flex-1" icon={Edit3}>Edit</Button>
                        <Button onClick={() => { if(window.confirm("Delete?")) { onDishDelete?.(dish.id); onClose(); } }} variant="danger" className="flex-1" icon={Trash2}>Delete</Button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 md:pb-10">
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-bold text-lg">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full"><ArrowRight className="rotate-180 text-slate-400" size={20} /></button>
            <span className="hidden sm:inline">{restaurant.name}</span>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={toggleManagerMode} className={`p-2 rounded-xl transition-colors ${isManagerMode ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-white'}`}>{isManagerMode ? <Unlock size={20}/> : <Lock size={20}/>}</button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-white hover:bg-white/5 rounded-xl group"><ShoppingBag />{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 rounded-full text-[10px] w-5 h-5 flex items-center justify-center">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}</button>
          </div>
      </nav>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">{categories.map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-slate-900 text-slate-400 border border-white/5'}`}>{cat}</button>)}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map(dish => (
                <div key={dish.id} onClick={() => setSelectedDish(dish)} onMouseEnter={() => setHoveredDishId(dish.id)} onMouseLeave={() => setHoveredDishId(null)} className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col">
                    <div className="relative aspect-[4/3] bg-slate-800">
                        <div className={`absolute inset-0 z-20 transition-opacity duration-500 ${hoveredDishId === dish.id && !dish.videoUrl ? 'opacity-100' : 'opacity-0'}`}><MiniDishVisualizer dish={dish} /></div>
                        <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${hoveredDishId === dish.id && !dish.videoUrl ? 'opacity-0' : 'opacity-100'}`}><img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" /></div>
                        {isManagerMode && (
                            <div className="absolute top-2 left-2 z-30 flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setEditingDish(dish); }} className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-orange-500"><Edit3 size={14}/></button>
                                <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) onDishDelete?.(dish.id); }} className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-red-500"><Trash2 size={14}/></button>
                            </div>
                        )}
                        <div className="absolute bottom-3 right-3 z-30 bg-white text-black px-3 py-1 rounded-lg font-bold text-sm shadow-lg">₹{dish.price}</div>
                    </div>
                    <div className="p-5 flex-1"><h3 className="text-xl font-bold text-white">{dish.name}</h3><p className="text-sm text-slate-400 line-clamp-2">{dish.description}</p></div>
                </div>
            ))}
        </div>
      </div>

      {selectedDish && <DetailModal dish={selectedDish} onClose={() => setSelectedDish(null)} />}
      
      {/* Editor Modal in Customer View */}
      {editingDish && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
              <div className="w-full max-w-2xl">
                  <DishEditor dish={editingDish} onSave={(d) => { onDishUpdate?.(d); setEditingDish(null); setSelectedDish(null); }} onCancel={() => setEditingDish(null)} onDelete={(id) => { onDishDelete?.(id); setEditingDish(null); setSelectedDish(null); }} />
              </div>
          </div>
      )}

      {/* PIN Pad */}
      {showPinPad && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur">
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 text-center space-y-4">
                  <h3 className="text-white font-bold">Enter Staff PIN</h3>
                  <input type="password" autoFocus className="bg-slate-800 text-white text-center text-2xl tracking-widest p-3 rounded-xl w-full outline-none border border-slate-700 focus:border-orange-500" onKeyDown={e => { if(e.key === 'Enter') handlePinSubmit(e.currentTarget.value); }} />
                  <p className="text-xs text-slate-500">Default: 1234</p>
                  <Button onClick={() => setShowPinPad(false)} variant="ghost" className="w-full">Cancel</Button>
              </div>
          </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end animate-in slide-in-from-right">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsCartOpen(false)} />
            <div className="relative w-full max-w-md bg-slate-900 h-full p-6 flex flex-col border-l border-white/10">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Your Order</h2><button onClick={() => setIsCartOpen(false)}><X className="text-white"/></button></div>
                <div className="mb-6"><label className="text-xs text-slate-400 font-bold uppercase">Table Number</label><input type="text" value={tableNo} onChange={e => setTableNo(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl mt-1 border border-slate-700 focus:border-orange-500 outline-none" /></div>
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl"><div className="flex gap-3"><img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover"/><div className="text-white"><p className="font-bold">{item.name}</p><p className="text-sm text-orange-500">₹{item.price}</p></div></div><span className="font-bold text-white">x{item.quantity}</span></div>
                    ))}
                </div>
                {cart.length > 0 && (
                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between text-xl font-bold text-white"><span>Total</span><span>₹{cartTotal}</span></div>
                        <Button onClick={() => { 
                            if(onPlaceOrder) onPlaceOrder({ id: Math.random().toString(36).substr(2,9), restaurantId: restaurant.id, tableNo, items: cart, total: cartTotal, status: 'pending', timestamp: Date.now() });
                            setOrderSuccess(true); setCart([]); setIsCartOpen(false); 
                        }} className="w-full py-4">Place Order</Button>
                    </div>
                )}
            </div>
        </div>
      )}
      
      {orderSuccess && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur">
            <div className="bg-slate-900 p-10 rounded-3xl text-center border border-green-500/20"><CheckCircle size={48} className="text-green-500 mx-auto mb-4"/><h2 className="text-white text-2xl font-bold">Order Sent to Kitchen!</h2><p className="text-slate-400 mt-2">Sit back and relax.</p><Button className="mt-6 w-full" onClick={() => setOrderSuccess(false)}>Done</Button></div>
        </div>
      )}
    </div>
  );
};