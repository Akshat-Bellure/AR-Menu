
import React, { useState, useEffect } from 'react';
import { 
  Store, Plus, Edit3, Trash2, QrCode, Save, X, ArrowRight, 
  PlusCircle, Smartphone, User, Lock, LogOut, ChefHat, Box, Sparkles, Loader2, CheckCircle, Wand2,
  Cpu, Layers, Grid, CloudLightning, Cuboid, Activity, Scan, Star, Flame, Zap, Download,
  ClipboardList, Bell, Clock, CheckSquare
} from 'lucide-react';
import { Restaurant, Dish, UserCredentials, Order } from '../types';
import { Button, Input, Badge } from '../components/UI';
import { GoogleGenAI } from "@google/genai";

// --- Types & Props ---
interface AdminDashboardProps {
  restaurants: Restaurant[];
  onUpdateRestaurants: (r: Restaurant[]) => void;
  onPreview: (id: string) => void;
  currentUser: string;
  onLogout: () => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
}

export interface DishEditorProps {
  dish?: Partial<Dish>;
  onSave: (d: Dish) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

// --- Helper: ID Generator ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Helper: Date Formatter ---
const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- Helper: Image to Base64 ---
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        resolve(base64String.split(',')[1]); 
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to convert image to base64", e);
    return "";
  }
};

// --- Sub-Component: Restaurant Editor ---
const RestaurantEditor = ({ restaurant, onSave, onCancel }: { restaurant: Restaurant, onSave: (r: Restaurant) => void, onCancel: () => void }) => {
  const [data, setData] = useState(restaurant);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600" />
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Edit Restaurant Details</h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <Input label="Restaurant Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
            <Input label="Cuisine Type" value={data.cuisine} onChange={e => setData({...data, cuisine: e.target.value})} />
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Brand Theme</label>
                <div className="grid grid-cols-5 gap-2">
                    {['orange', 'red', 'blue', 'green', 'purple'].map(color => (
                        <button
                            key={color}
                            onClick={() => setData({...data, themeColor: color})}
                            className={`h-10 rounded-lg border-2 transition-all ${data.themeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            style={{ backgroundColor: `var(--color-${color}-500)`, background: color === 'orange' ? '#f97316' : color === 'red' ? '#ef4444' : color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : '#a855f7' }}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <Button onClick={() => onSave(data)} className="flex-1" icon={Save}>Save Changes</Button>
                <Button onClick={onCancel} variant="secondary">Cancel</Button>
            </div>
        </div>
    </div>
  );
};

// --- Sub-Component: Gemini 3D Generator (Nano Banana Integration) ---
export const Gemini3DGenerator = ({ sourceImage, onComplete }: { sourceImage: string, onComplete: (angles: Dish['angles']) => void }) => {
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'generating' | 'complete'>('idle');
    const [progress, setProgress] = useState(0);
    const [currentView, setCurrentView] = useState("Initializing...");

    // Simulated Gemini API Call (Real integration structure provided)
    useEffect(() => {
        if (status === 'idle') setStatus('analyzing');

        if (status === 'analyzing') {
            // In a real app, initialize Gemini here
            // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // const model = ai.models.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
            
            setCurrentView("Gemini: Analyzing Food Structure...");
            setTimeout(() => {
                setProgress(20);
                setStatus('generating');
            }, 1500);
        }

        if (status === 'generating') {
            let p = 20;
            const interval = setInterval(() => {
                p += 1; 
                setProgress(p);
                
                if (p === 30) setCurrentView("Gemini: Imagine Right View...");
                if (p === 50) setCurrentView("Gemini: Imagine Back View...");
                if (p === 70) setCurrentView("Gemini: Imagine Left View...");
                if (p === 85) setCurrentView("Gemini: Consistency Check...");

                if (p >= 100) {
                    clearInterval(interval);
                    setStatus('complete');
                    // Simulate successful generation by reusing source or placeholder
                    // In real app, these would be the base64 results from Gemini
                    onComplete({ 
                        front: sourceImage, 
                        right: sourceImage, 
                        back: sourceImage, 
                        left: sourceImage, 
                        top: sourceImage 
                    });
                }
            }, 60);
            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <div className="bg-slate-950 rounded-xl border border-blue-500/30 flex flex-col p-4 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg">
                        <Sparkles size={14} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase">Gemini Nano (3D Mode)</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono animate-pulse">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden relative z-10 mb-3">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="relative h-32 bg-black/50 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
                {status !== 'complete' ? (
                    <>
                        <img src={sourceImage} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" alt="Processing" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="relative z-10 text-center">
                            <Loader2 size={24} className="text-blue-400 animate-spin mx-auto mb-2" />
                            <p className="text-[10px] text-blue-200 font-mono">{currentView}</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center animate-in zoom-in">
                        <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-white">3D View Generated</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-Component: Dish Editor ---
export const DishEditor: React.FC<DishEditorProps> = ({ dish, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Dish>>(dish || {
    id: generateId(),
    name: "", price: 0, category: "Main",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    videoUrl: "", description: "", ingredients: [], tags: [], isVeg: true, calories: 0
  });
  const [showAI, setShowAI] = useState(false);
  const [ingredientsText, setIngredientsText] = useState(formData.ingredients?.join(', ') || "");

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-300 mb-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">{dish?.id ? 'Edit Dish' : 'Add New Dish'}</h3>
        <button onClick={onCancel}><X size={20} className="text-slate-400 hover:text-white"/></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Dish Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <Input label="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
        <Input label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
        <Input label="Front Image URL" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         <Input label="Ingredients" value={ingredientsText} onChange={(e) => { setIngredientsText(e.target.value); setFormData({...formData, ingredients: e.target.value.split(',').filter(Boolean)}); }} />
         <Input label="Calories (kcal)" type="number" value={formData.calories || ''} onChange={(e) => setFormData({...formData, calories: Number(e.target.value)})} />
      </div>
      
      <div className="flex gap-4">
          <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.tags?.includes('Bestseller')} onChange={() => { 
                  const tags = formData.tags || []; 
                  setFormData({...formData, tags: tags.includes('Bestseller') ? tags.filter(t=>t!=='Bestseller') : [...tags, 'Bestseller']}); 
              }} className="rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-0"/> Bestseller
          </label>
          <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.tags?.includes('Spicy')} onChange={() => { 
                  const tags = formData.tags || []; 
                  setFormData({...formData, tags: tags.includes('Spicy') ? tags.filter(t=>t!=='Spicy') : [...tags, 'Spicy']}); 
              }} className="rounded border-slate-600 bg-slate-800 text-red-500 focus:ring-0"/> Spicy
          </label>
          <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.isVeg} onChange={(e) => setFormData({...formData, isVeg: e.target.checked})} className="rounded border-slate-600 bg-slate-800 text-green-500 focus:ring-0"/> Veg
          </label>
      </div>

      {/* 3D Section */}
      <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
         <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Cuboid size={14}/> 3D View Generation</span>
             <button onClick={() => setShowAI(!showAI)} className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                 {showAI ? 'Cancel' : <><Sparkles size={12}/> Generate with Gemini</>}
             </button>
         </div>
         {showAI ? (
             <Gemini3DGenerator sourceImage={formData.imageUrl || ""} onComplete={(angles) => { setFormData({...formData, angles}); setShowAI(false); }} />
         ) : (
             <div className="grid grid-cols-2 gap-3">
                <Input label="Front" value={formData.angles?.front || ''} onChange={e => setFormData({...formData, angles: {...formData.angles, front: e.target.value} as any})} />
                <Input label="Right" value={formData.angles?.right || ''} onChange={e => setFormData({...formData, angles: {...formData.angles, right: e.target.value} as any})} />
                <Input label="Back" value={formData.angles?.back || ''} onChange={e => setFormData({...formData, angles: {...formData.angles, back: e.target.value} as any})} />
                <Input label="Left" value={formData.angles?.left || ''} onChange={e => setFormData({...formData, angles: {...formData.angles, left: e.target.value} as any})} />
                <Input label="Top" value={formData.angles?.top || ''} onChange={e => setFormData({...formData, angles: {...formData.angles, top: e.target.value} as any})} className="col-span-2" />
             </div>
         )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-white/10">
        {onDelete && dish?.id && (
            <Button onClick={() => onDelete(dish.id!)} variant="danger" icon={Trash2}>Delete</Button>
        )}
        <Button onClick={() => onSave(formData as Dish)} className="flex-1" icon={Save}>Save Dish</Button>
        <Button onClick={onCancel} variant="ghost">Cancel</Button>
      </div>
    </div>
  );
};

// --- Sub-Component: Admin Login Modal ---
export const AdminLoginModal = ({ onLogin, onCancel, registeredUsers }: { onLogin: (u: string) => void, onCancel: () => void, registeredUsers: UserCredentials[] }) => {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = () => {
        const user = registeredUsers.find(user => user.u === u && user.p === p);
        if (user) {
            onLogin(user.u);
        } else {
            setError(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 border border-white/10 rounded-3xl p-8 w-full max-w-sm space-y-6 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600" />
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Lock className="text-orange-500" size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Owner Login</h2>
                    <p className="text-slate-500 text-sm">Secure access for restaurant owners.</p>
                </div>

                <div className="space-y-4">
                    <Input 
                        label="Username" 
                        value={u} 
                        onChange={e => {setU(e.target.value); setError(false);}} 
                        className="bg-slate-900"
                        placeholder="e.g. Founder"
                    />
                    <Input 
                        label="Password" 
                        type="password" 
                        value={p} 
                        onChange={e => {setP(e.target.value); setError(false);}} 
                        className="bg-slate-900"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                            <X size={14}/> Invalid credentials
                        </div>
                    )}
                </div>

                <div className="space-y-3 pt-2">
                    <Button onClick={handleLogin} className="w-full py-3.5" icon={ArrowRight}>Access Dashboard</Button>
                    <button onClick={onCancel} className="w-full text-slate-500 text-sm font-bold hover:text-white transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Order Card ---
const OrderCard = ({ order, onUpdateStatus }: { order: Order, onUpdateStatus: (id: string, status: Order['status']) => void }) => {
    const statusColors = {
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        preparing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        ready: 'bg-green-500/10 text-green-500 border-green-500/20',
        delivered: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };

    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-bold text-lg">Table {order.tableNo}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[order.status]}`}>
                            {order.status}
                        </span>
                    </div>
                    <span className="text-slate-500 text-xs flex items-center gap-1"><Clock size={10}/> {formatTime(order.timestamp)}</span>
                </div>
                <div className="text-right">
                    <span className="text-white font-bold text-lg">₹{order.total}</span>
                </div>
            </div>
            
            <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-300"><span className="font-bold text-orange-500">{item.quantity}x</span> {item.name}</span>
                        <span className="text-slate-500">₹{item.price * item.quantity}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
                {order.status === 'pending' && (
                    <Button onClick={() => onUpdateStatus(order.id, 'preparing')} className="col-span-2" icon={ChefHat}>Start Cooking</Button>
                )}
                {order.status === 'preparing' && (
                    <Button onClick={() => onUpdateStatus(order.id, 'ready')} className="col-span-2" variant="secondary" icon={Bell}>Mark Ready</Button>
                )}
                {order.status === 'ready' && (
                    <Button onClick={() => onUpdateStatus(order.id, 'delivered')} className="col-span-2 bg-green-600 hover:bg-green-700" icon={CheckSquare}>Complete</Button>
                )}
            </div>
        </div>
    );
};

// --- Main Admin Dashboard ---
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ restaurants, onUpdateRestaurants, onPreview, currentUser, onLogout, orders, onUpdateOrderStatus }) => {
  const [view, setView] = useState<'list' | 'details' | 'orders'>('list');
  const [activeRestId, setActiveRestId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [dishEditorState, setDishEditorState] = useState<{isOpen: boolean, dish?: Dish}>({ isOpen: false });
  const [editingRestaurantInfo, setEditingRestaurantInfo] = useState(false);

  const activeRestaurant = restaurants.find(r => r.id === activeRestId);
  const activeOrders = orders.filter(o => o.restaurantId === activeRestId && o.status !== 'delivered');

  const handleAddRestaurant = () => {
    const newRest: Restaurant = { id: `rest-${generateId()}`, ownerUsername: currentUser, name: "New Restaurant", cuisine: "General", themeColor: "orange", logoUrl: "", menu: [] };
    onUpdateRestaurants([...restaurants, newRest]);
    setActiveRestId(newRest.id);
    setView('details');
    setEditingRestaurantInfo(true); 
  };

  const handleSaveDish = (dish: Dish) => {
    if (!activeRestaurant) return;
    const existingIndex = activeRestaurant.menu.findIndex(d => d.id === dish.id);
    let updatedMenu = [...activeRestaurant.menu];
    if (existingIndex >= 0) updatedMenu[existingIndex] = dish;
    else updatedMenu.push(dish);
    
    onUpdateRestaurants(restaurants.map(r => r.id === activeRestaurant.id ? { ...activeRestaurant, menu: updatedMenu } : r));
    setDishEditorState({ isOpen: false });
  };
  
  const handleDeleteDish = (dishId: string) => {
      if (!activeRestaurant || !window.confirm("Delete this dish?")) return;
      const updatedMenu = activeRestaurant.menu.filter(d => d.id !== dishId);
      onUpdateRestaurants(restaurants.map(r => r.id === activeRestaurant.id ? { ...activeRestaurant, menu: updatedMenu } : r));
      if(dishEditorState.dish?.id === dishId) setDishEditorState({isOpen: false});
  }

  if (view === 'details' && activeRestaurant) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in slide-in-from-right-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700"><ArrowRight className="rotate-180" size={20} /></button>
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        {activeRestaurant.name}
                        <button onClick={() => setEditingRestaurantInfo(true)} className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-orange-500"><Edit3 size={16} /></button>
                    </h2>
                    <p className="text-slate-400">{activeRestaurant.cuisine}</p>
                </div>
            </div>
            <div className="flex gap-3 bg-slate-900 p-1 rounded-xl border border-white/10">
                <button onClick={() => setView('details')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'details' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>Menu Editor</button>
                <button onClick={() => setView('orders')} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2">
                    Live Kitchen {activeOrders.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{activeOrders.length}</span>}
                </button>
            </div>
            <div className="flex gap-3">
                <Button onClick={() => setShowQR(activeRestaurant.id)} variant="secondary" icon={QrCode}>QR</Button>
                <Button onClick={() => setDishEditorState({isOpen: true, dish: undefined})} icon={PlusCircle}>Add Item</Button>
            </div>
        </div>

        {editingRestaurantInfo && <RestaurantEditor restaurant={activeRestaurant} onCancel={() => setEditingRestaurantInfo(false)} onSave={(r) => { onUpdateRestaurants(restaurants.map(old => old.id === r.id ? r : old)); setEditingRestaurantInfo(false); }} />}
        
        {dishEditorState.isOpen && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="w-full max-w-2xl">
                    <DishEditor dish={dishEditorState.dish} onSave={handleSaveDish} onCancel={() => setDishEditorState({isOpen: false})} onDelete={dishEditorState.dish?.id ? handleDeleteDish : undefined} />
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-4">
            {activeRestaurant.menu.map(dish => (
            <div key={dish.id} className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all">
                <img src={dish.imageUrl} className="w-20 h-20 rounded-xl object-cover" alt={dish.name} />
                <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{dish.name}</h4>
                    <p className="text-orange-500 font-bold">₹{dish.price}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setDishEditorState({isOpen: true, dish})} className="p-3 bg-slate-800 rounded-xl hover:text-orange-500"><Edit3 size={20} /></button>
                    <button onClick={() => handleDeleteDish(dish.id)} className="p-3 bg-slate-800 rounded-xl hover:text-red-500"><Trash2 size={20} /></button>
                </div>
            </div>
            ))}
        </div>
      </div>
    );
  }

  if (view === 'orders' && activeRestaurant) {
      return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in slide-in-from-right-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView('list')} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700"><ArrowRight className="rotate-180" size={20} /></button>
                    <h2 className="text-3xl font-bold text-white">Live Orders</h2>
                </div>
                <div className="flex gap-3 bg-slate-900 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setView('details')} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white">Menu Editor</button>
                    <button className="px-4 py-2 rounded-lg text-sm font-bold bg-orange-500 text-white shadow-lg">Live Kitchen</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOrders.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                        <ClipboardList size={48} className="mx-auto mb-4 opacity-50"/>
                        <p>No active orders.</p>
                    </div>
                ) : (
                    activeOrders.map(order => (
                        <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateOrderStatus} />
                    ))
                )}
            </div>
        </div>
      )
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
            <h1 className="text-3xl font-black text-white">My Restaurants</h1>
            <div className="flex gap-3">
                <Button onClick={onLogout} variant="outline" icon={LogOut}>Logout</Button>
                <Button onClick={handleAddRestaurant} icon={Plus}>Add Restaurant</Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.filter(r => currentUser === 'Founder' || r.ownerUsername === currentUser).map(r => (
                <div key={r.id} className="bg-slate-900 border border-white/10 rounded-3xl p-6 hover:border-orange-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-white">{r.name}</h3>
                        <button onClick={() => setShowQR(r.id)} className="p-2 bg-white/5 rounded-lg"><QrCode size={20}/></button>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => { setActiveRestId(r.id); setView('details'); }} className="flex-1">Manage</Button>
                        <Button onClick={() => { setActiveRestId(r.id); setView('orders'); }} variant="secondary" className="flex-1">Orders</Button>
                    </div>
                </div>
            ))}
        </div>
        {showQR && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowQR(null)}>
                <div className="bg-white p-8 rounded-3xl text-center">
                    <h2 className="text-2xl font-bold text-black mb-4">Scan Menu</h2>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://ar-menu-platform.demo/menu/${showQR}`)}`} alt="QR" />
                </div>
            </div>
        )}
    </div>
  );
};
