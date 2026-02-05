
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  UserPlus,
  XCircle,
  BrainCircuit,
  Upload,
  Truck,
  UserCheck,
  TrendingUp,
  Download,
  FileText,
  Layers,
  DollarSign
} from 'lucide-react';

import { User, Product, Customer, Sale, Purchase, AppSettings, UserRole, UserStatus, SaleItem, SalesmanStock } from './types';
import { getBusinessInsights } from './services/geminiService';

// --- INITIAL DATA ---
const ADMIN_EMAIL = 'roki255190@gmail.com';

const initialSettings: AppSettings = {
  companyName: 'QUEEN FOOD PRODUCT LTD',
  companyNameArabic: 'شركة كوين للمنتجات الغذائية المحدودة',
  logoUrl: 'https://seeklogo.com/images/P/pran-logo-4B3A8B1A2A-seeklogo.com.png',
  vatNumber: '35252630700003',
  exciseTrn: '35252630700003',
  address: 'Dammam, Eastern Province, Saudi Arabia',
  phone: '0560659793',
  email: 'contact@queenfood.com',
  vatPercent: 15,
  warehouseDetails: 'Dammam Central Store'
};

const initialProducts: Product[] = [
  { id: '1', name: 'Drinko Float Pineapple 250ml X 24pcs', sku: '58064', category: 'Beverage', purchasePrice: 20, salePrice: 28, stock: 100, uom: '24' },
  { id: '2', name: 'Drinko Float Strawberry 250ml X 24pcs', sku: '58065', category: 'Beverage', purchasePrice: 20, salePrice: 28, stock: 50, uom: '24' },
  { id: '3', name: 'Mughal Dry Whole Chili 40gm X 60pcs', sku: '59701', category: 'Spices', purchasePrice: 60, salePrice: 80, stock: 30, uom: '60' },
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('khm_users');
    return saved ? JSON.parse(saved) : [{ id: 'admin', email: ADMIN_EMAIL, role: 'ADMIN', status: 'APPROVED', name: 'Admin Roki' }];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('khm_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [salesmanStocks, setSalesmanStocks] = useState<SalesmanStock[]>(() => {
    const saved = localStorage.getItem('khm_salesman_stocks');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('khm_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('khm_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('khm_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('khm_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [activeInvoice, setActiveInvoice] = useState<Sale | null>(null);

  useEffect(() => {
    localStorage.setItem('khm_users', JSON.stringify(allUsers));
    localStorage.setItem('khm_products', JSON.stringify(products));
    localStorage.setItem('khm_salesman_stocks', JSON.stringify(salesmanStocks));
    localStorage.setItem('khm_customers', JSON.stringify(customers));
    localStorage.setItem('khm_sales', JSON.stringify(sales));
    localStorage.setItem('khm_purchases', JSON.stringify(purchases));
    localStorage.setItem('khm_settings', JSON.stringify(settings));
  }, [allUsers, products, salesmanStocks, customers, sales, purchases, settings]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') setInstallPrompt(null);
    });
  };

  const handleLogin = (email: string) => {
    const found = allUsers.find(u => u.email === email);
    if (!found) return alert("User not found.");
    if (found.status === 'PENDING') return alert("Account pending admin approval.");
    setUser(found);
  };

  const handleSignup = (name: string, email: string) => {
    if (allUsers.find(u => u.email === email)) return alert("User already exists.");
    const newUser: User = { id: Date.now().toString(), name, email, role: 'SALESMAN', status: 'PENDING' };
    setAllUsers([...allUsers, newUser]);
    alert("Signup successful! Admin will approve your account soon.");
  };

  const handleLogout = () => setUser(null);

  if (!user) return <Login onLogin={handleLogin} onSignup={handleSignup} />;

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 no-print overflow-hidden flex-col md:flex-row">
        <Sidebar role={user.role} onInstall={handleInstallClick} showInstall={!!installPrompt} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-xl font-bold text-blue-600 uppercase tracking-tight truncate">{settings.companyName}</h1>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold truncate max-w-[150px]">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-400 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Dashboard sales={sales} products={products} purchases={purchases} isAdmin={user.role === 'ADMIN'} />} />
              <Route path="/sales" element={<SalesModule products={products} setProducts={setProducts} salesmanStocks={salesmanStocks} setSalesmanStocks={setSalesmanStocks} customers={customers} settings={settings} sales={sales} setSales={setSales} user={user} onPrint={setActiveInvoice} />} />
              <Route path="/purchases" element={<PurchaseModule products={products} setProducts={setProducts} purchases={purchases} setPurchases={setPurchases} isAdmin={user.role === 'ADMIN'} />} />
              <Route path="/inventory" element={<InventoryModule products={products} sales={sales} salesmanStocks={salesmanStocks} isAdmin={user.role === 'ADMIN'} />} />
              <Route path="/salesman" element={user.role === 'ADMIN' ? <SalesmanModule allUsers={allUsers} setAllUsers={setAllUsers} /> : <Navigate to="/" />} />
              <Route path="/wholesale" element={user.role === 'ADMIN' ? <WholesaleModule products={products} setProducts={setProducts} allUsers={allUsers} salesmanStocks={salesmanStocks} setSalesmanStocks={setSalesmanStocks} /> : <Navigate to="/" />} />
              <Route path="/reports" element={<ReportModule sales={sales} purchases={purchases} products={products} onPrint={setActiveInvoice} />} />
              <Route path="/customers" element={<CustomerModule customers={customers} setCustomers={setCustomers} />} />
              <Route path="/settings" element={user.role === 'ADMIN' ? <SettingsModule settings={settings} setSettings={setSettings} allUsers={allUsers} setAllUsers={setAllUsers} /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>

      {activeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 no-print flex items-center justify-center p-2 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl relative flex flex-col w-full max-w-[900px] my-8">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
               <div className="flex items-center gap-2">
                 <FileText className="text-blue-600" size={20} />
                 <h3 className="font-bold">Tax Invoice Preview</h3>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-bold active:scale-95 transition-all shadow-md"><Printer size={18} /> Print / Save PDF</button>
                 <button onClick={() => setActiveInvoice(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><XCircle size={24} /></button>
               </div>
            </div>
            <div className="p-0 flex justify-center bg-gray-200">
               <div className="bg-white shadow-inner">
                  <InvoicePrint sale={activeInvoice} settings={settings} />
               </div>
            </div>
          </div>
        </div>
      )}
      <div className="print-only">
        {activeInvoice && <InvoicePrint sale={activeInvoice} settings={settings} />}
      </div>
    </Router>
  );
}

// --- SUB-COMPONENTS ---

function Dashboard({ sales, products, purchases, isAdmin }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Sales" value={`SR ${sales.reduce((a:any, s:any) => a + s.total, 0).toFixed(2)}`} color="blue" icon={<ShoppingCart />} />
        <StatCard title="Stock Count" value={products.reduce((a:any, p:any) => a + p.stock, 0).toString()} color="green" icon={<Package />} />
        {isAdmin && (
          <>
            <Link to="/salesman" className="group"><div className="bg-white p-6 rounded-xl border shadow-sm hover:border-blue-500 transition-all flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">Salesman Management</p><p className="text-xl font-bold mt-1">Manage Staff</p></div><div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><UserCheck size={24} /></div></div></Link>
            <Link to="/wholesale" className="group"><div className="bg-white p-6 rounded-xl border shadow-sm hover:border-blue-500 transition-all flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">Stock Distribution</p><p className="text-xl font-bold mt-1">Assign Stock</p></div><div className="p-3 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors"><Truck size={24} /></div></div></Link>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: any) {
  const colors: any = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', red: 'bg-red-50 text-red-600', orange: 'bg-orange-50 text-orange-600' };
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
      <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-black mt-1 text-gray-900">{value}</p></div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>{React.cloneElement(icon, { size: 24 })}</div>
    </div>
  );
}

function Sidebar({ role, onInstall, showInstall }: any) {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Invoice / Sale', icon: ShoppingCart, path: '/sales' },
    { name: 'Inventory', icon: BarChart3, path: '/inventory' },
    { name: 'Customers', icon: Users, path: '/customers' },
  ];
  if (role === 'ADMIN') {
    menuItems.splice(2, 0, { name: 'Purchases', icon: Package, path: '/purchases' });
    menuItems.push({ name: 'Salesman', icon: UserCheck, path: '/salesman' });
    menuItems.push({ name: 'Distribute', icon: Truck, path: '/wholesale' });
    menuItems.push({ name: 'Reports', icon: Printer, path: '/reports' });
    menuItems.push({ name: 'Settings', icon: Settings, path: '/settings' });
  }
  return (
    <div className="w-full md:w-64 bg-white border-b md:border-r flex flex-col shrink-0 no-print overflow-y-auto max-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 text-blue-600 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <span className="text-xl font-bold uppercase">Queen Sales</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>
        {showInstall && <button onClick={onInstall} className="w-full mt-6 bg-indigo-50 text-indigo-600 p-4 rounded-2xl flex flex-col items-center gap-2 border border-indigo-100 group hover:bg-indigo-600 hover:text-white transition-all"><Download size={24} /><div className="text-center font-black uppercase text-xs">Install App</div></button>}
      </div>
    </div>
  );
}

function Login({ onLogin, onSignup }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
        <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4 font-black text-2xl">Q</div><h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Login' : 'Join as Salesman'}</h2></div>
        <form onSubmit={(e) => { e.preventDefault(); isLogin ? onLogin(form.email) : onSignup(form.name, form.email); }} className="space-y-4">
          {!isLogin && <input required placeholder="Your Name" className="w-full px-4 py-3 border rounded-xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />}
          <input required type="email" placeholder="Gmail Address" className="w-full px-4 py-3 border rounded-xl" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">{isLogin ? 'Sign In' : 'Request Approval'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-sm text-blue-600 font-bold hover:underline">{isLogin ? 'New Salesman? Create ID' : 'Back to Login'}</button>
      </div>
    </div>
  );
}

function SalesmanModule({ allUsers, setAllUsers }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [newS, setNewS] = useState({ name: '', email: '' });
  const save = (e: any) => { e.preventDefault(); setAllUsers([...allUsers, { id: Date.now().toString(), ...newS, role: 'SALESMAN', status: 'APPROVED' }]); setIsAdding(false); };
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Salesman Management</h2><button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">{isAdding ? 'Cancel' : 'Create Salesman'}</button></div>
      {isAdding && <form onSubmit={save} className="bg-white p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-4"><input required placeholder="Name" className="px-4 py-3 border rounded-xl" value={newS.name} onChange={e => setNewS({...newS, name: newS.name})} /><input required placeholder="Email" className="px-4 py-3 border rounded-xl" value={newS.email} onChange={e => setNewS({...newS, email: e.target.value})} /><button className="bg-green-600 text-white font-bold rounded-xl">Save</button></form>}
      <div className="bg-white border rounded-2xl overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y">{allUsers.filter((u:any)=>u.role==='SALESMAN').map((u:any)=>(<tr key={u.id}><td className="px-6 py-4 font-bold">{u.name}</td><td className="px-6 py-4">{u.email}</td><td className="px-6 py-4 text-green-600 font-bold">{u.status}</td></tr>))}</tbody></table></div>
    </div>
  );
}

function WholesaleModule({ products, setProducts, allUsers, salesmanStocks, setSalesmanStocks }: any) {
  const [form, setForm] = useState({ salesmanId: '', productId: '', qty: 0, sellPrice: 0 });
  const handleTransfer = (e: any) => {
    e.preventDefault();
    const p = products.find((x: any) => x.id === form.productId);
    if (!p || p.stock < form.qty) return alert("Low Stock");
    setProducts(products.map((x: any) => x.id === form.productId ? { ...x, stock: x.stock - form.qty } : x));
    setSalesmanStocks([...salesmanStocks, { salesmanId: form.salesmanId, productId: form.productId, productName: p.name, sku: p.sku, uom: p.uom, stock: form.qty, assignedPrice: form.sellPrice }]);
    setForm({ salesmanId: '', productId: '', qty: 0, sellPrice: 0 });
    alert("Stock assigned successfully");
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border shadow-sm"><h3 className="text-xl font-bold mb-6">Assign Stock to Salesman</h3><form onSubmit={handleTransfer} className="space-y-4"><select required className="w-full p-3 border rounded-xl" value={form.salesmanId} onChange={e => setForm({...form, salesmanId: e.target.value})}><option value="">-- Choose Salesman --</option>{allUsers.filter((u: any) => u.role === 'SALESMAN').map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select><select required className="w-full p-3 border rounded-xl" value={form.productId} onChange={e => setForm({...form, productId: e.target.value, sellPrice: products.find((x:any)=>x.id===e.target.value)?.salePrice || 0})}><option value="">-- Choose Product --</option>{products.map((p: any) => <option key={p.id} value={p.id}>{p.name} (Available: {p.stock})</option>)}</select><div className="grid grid-cols-2 gap-4"><input type="number" required placeholder="Qty" className="w-full p-3 border rounded-xl" value={form.qty} onChange={e => setForm({...form, qty: Number(e.target.value)})} /><input type="number" step="0.01" required placeholder="Price" className="w-full p-3 border rounded-xl" value={form.sellPrice} onChange={e => setForm({...form, sellPrice: Number(e.target.value)})} /></div><button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-4">Confirm Distribution</button></form></div>
    </div>
  );
}

function SalesModule({ products, setProducts, salesmanStocks, setSalesmanStocks, customers, settings, sales, setSales, user, onPrint }: any) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const availableItems = useMemo(() => user.role === 'ADMIN' ? products : salesmanStocks.filter((s: any) => s.salesmanId === user.id).map((s: any) => ({ id: s.productId, name: s.productName, sku: s.sku, uom: s.uom, stock: s.stock, salePrice: s.assignedPrice })), [user, products, salesmanStocks]);
  const addToCart = (p: any) => { if (p.stock <= 0) return alert("Out of stock"); const ex = cart.find(i => i.productId === p.id); if (ex) setCart(cart.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i)); else setCart([...cart, { productId: p.id, productName: p.name, sku: p.sku, uom: p.uom || '24', quantity: 1, price: p.salePrice }]); };
  const subtotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
  const vat = (subtotal * settings.vatPercent) / 100;
  const total = subtotal + vat;
  const processSale = () => {
    const customer = customers.find((c: any) => c.id === selectedCustomerId);
    const saleItems = cart.map(i => {
      const uomVal = parseInt(i.uom) || 24;
      return { 
        productId: i.productId, 
        productName: i.productName, 
        quantity: i.quantity, 
        quantityCtn: Math.floor(i.quantity / uomVal), 
        priceCtn: i.price * uomVal, 
        grossAmount: i.price, 
        exciseDuty: 0, 
        discountPercent: 0, 
        discountVal: 0, 
        vatPercent: settings.vatPercent, 
        vatAmount: (i.price * i.quantity * settings.vatPercent) / 100, 
        totalIncl: (i.price * i.quantity) * (1 + settings.vatPercent / 100), 
        uom: i.uom 
      };
    });
    const s: Sale = { id: `SALE-${Date.now()}`, invoiceNo: `20/2024-${Math.floor(Math.random()*1000000)}`, customerId: selectedCustomerId, customerName: customer?.name || 'Walk-in', customerAddress: customer?.address, customerTrn: customer?.trn, items: saleItems, subtotal, vatAmount: vat, total, date: new Date().toISOString(), orderDate: new Date().toISOString(), deliveryDate: new Date().toISOString(), salesMan: user.name, paymentType: 'Credit', vehicleNo: 'KZA-4177', currency: 'SR', custCode: '12008', siteCode: '20400516', dmId: 'DM00589' };
    
    // Update stock
    if (user.role === 'ADMIN') {
      setProducts(products.map(p => {
        const ci = cart.find(item => item.productId === p.id);
        return ci ? { ...p, stock: p.stock - ci.quantity } : p;
      }));
    } else {
      setSalesmanStocks(salesmanStocks.map(s_stock => {
        const ci = cart.find(item => item.productId === s_stock.productId && s_stock.salesmanId === user.id);
        return ci ? { ...s_stock, stock: s_stock.stock - ci.quantity } : s_stock;
      }));
    }

    setSales([...sales, s]); setCart([]); setSelectedCustomerId(''); onPrint(s);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-3 border rounded-2xl" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
          {availableItems.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p: any) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border flex flex-col justify-between shadow-sm hover:border-blue-400 transition-all">
              <div><h4 className="font-bold text-sm">{p.name}</h4><p className="text-xs text-gray-400">SKU: {p.sku} | Stock: {p.stock}</p><p className="text-xs font-bold text-blue-600 mt-2">SR {p.salePrice.toFixed(2)}</p></div>
              <button onClick={() => addToCart(p)} className="mt-4 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border flex flex-col overflow-hidden shadow-sm">
        <div className="p-5 border-b font-bold">Checkout</div>
        <div className="p-5 border-b"><select className="w-full p-2 border rounded-xl text-sm" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}><option value="">Select Customer</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.map(i => <div key={i.productId} className="flex justify-between text-xs font-bold border-b pb-1"><span>{i.productName} (x{i.quantity})</span><span>SR {(i.price*i.quantity).toFixed(2)}</span></div>)}
        </div>
        <div className="p-5 bg-gray-50 border-t space-y-2">
          <div className="flex justify-between text-xs font-bold"><span>Total</span><span className="text-blue-600 text-lg">SR {total.toFixed(2)}</span></div>
          <button onClick={processSale} disabled={cart.length===0} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 disabled:opacity-50">Confirm Sale</button>
        </div>
      </div>
    </div>
  );
}

function InventoryModule({ products }: any) {
  return (<div className="space-y-6"><h2 className="text-2xl font-bold">Inventory</h2><div className="bg-white rounded-2xl border overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 border-b text-xs font-bold uppercase"><tr className="divide-x"><th className="px-6 py-4">Product</th><th className="px-6 py-4">SKU</th><th className="px-6 py-4 text-center">Stock</th><th className="px-6 py-4 text-right">Price</th></tr></thead><tbody className="divide-y text-sm">{products.map((p: any) => (<tr key={p.id} className="divide-x"><td className="px-6 py-4 font-bold">{p.name}</td><td className="px-6 py-4">{p.sku}</td><td className="px-6 py-4 text-center">{p.stock}</td><td className="px-6 py-4 text-right font-bold text-blue-600">SR {p.salePrice.toFixed(2)}</td></tr>))}</tbody></table></div></div>);
}

function PurchaseModule({ products, setProducts, purchases, setPurchases }: any) {
  const [form, setForm] = useState({ productId: '', quantity: 0, cost: 0, salePrice: 0 });
  const handlePurchase = (e: any) => {
    e.preventDefault();
    const p = products.find((x: any) => x.id === form.productId);
    if (!p) return;
    setProducts(products.map((x: any) => x.id === form.productId ? { ...x, stock: x.stock + form.quantity, purchasePrice: form.cost, salePrice: form.salePrice } : x));
    setPurchases([...purchases, { id: `PUR-${Date.now()}`, productName: p.name, ...form, date: new Date().toISOString(), total: form.quantity * form.cost }]);
    setForm({ productId: '', quantity: 0, cost: 0, salePrice: 0 });
    alert("Inventory Refilled");
  };
  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl border"><h3 className="text-xl font-bold mb-6">Refill Stock</h3><form onSubmit={handlePurchase} className="space-y-4"><select required className="w-full p-3 border rounded-xl" value={form.productId} onChange={e => setForm({...form, productId: e.target.value})}><option value="">Select Product</option>{products.map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}</select><div className="grid grid-cols-3 gap-4"><input type="number" required placeholder="Qty" className="p-3 border rounded-xl" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} /><input type="number" step="0.01" required placeholder="Cost" className="p-3 border rounded-xl" value={form.cost} onChange={e => setForm({...form, cost: Number(e.target.value)})} /><input type="number" step="0.01" required placeholder="Sale Price" className="p-3 border rounded-xl" value={form.salePrice} onChange={e => setForm({...form, salePrice: Number(e.target.value)})} /></div><button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Purchase & Refill</button></form></div>
  );
}

function ReportModule({ sales, onPrint }: any) {
  const [aiI, setAiI] = useState('');
  const rev = sales.reduce((a:any,s:any)=>a+s.total,0);
  const fetchAi = async () => setAiI(await getBusinessInsights({ rev, count: sales.length }));
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Sales Reports</h2><button onClick={fetchAi} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"><BrainCircuit size={18} /> AI Analysis</button></div>
      {aiI && <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-900 text-sm whitespace-pre-wrap">{aiI}</div>}
      <div className="bg-white border rounded-2xl overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50 border-b text-xs font-bold uppercase"><tr><th className="px-6 py-4">Invoice</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4 text-right">Total</th><th className="px-6 py-4 text-center">Action</th></tr></thead><tbody className="divide-y">{sales.map((s:any)=>(<tr key={s.id}><td className="px-6 py-4 font-mono text-xs">{s.invoiceNo}</td><td className="px-6 py-4 font-bold">{s.customerName}</td><td className="px-6 py-4 text-right font-black">SR {s.total.toFixed(2)}</td><td className="px-6 py-4 text-center"><button onClick={()=>onPrint(s)} className="text-blue-600 hover:bg-blue-50 px-4 py-1 rounded-lg font-bold border">Print</button></td></tr>))}</tbody></table></div>
    </div>
  );
}

function CustomerModule({ customers, setCustomers }: any) {
  const [isA, setIsA] = useState(false);
  const [newC, setNewC] = useState({ name: '', phone: '', address: '', trn: '' });
  const save = (e: any) => { e.preventDefault(); setCustomers([...customers, { id: Date.now().toString(), ...newC }]); setIsA(false); };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold">Customers</h2><button onClick={() => setIsA(!isA)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Add Customer</button></div>
      {isA && <form onSubmit={save} className="bg-white p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-4 gap-4"><input required placeholder="Name" className="p-3 border rounded-xl" value={newC.name} onChange={e => setNewC({...newC, name: e.target.value})} /><input placeholder="Phone" className="p-3 border rounded-xl" value={newC.phone} onChange={e => setNewC({...newC, phone: e.target.value})} /><input placeholder="TRN" className="p-3 border rounded-xl" value={newC.trn} onChange={e => setNewC({...newC, trn: e.target.value})} /><button className="bg-green-600 text-white font-bold rounded-xl">Save</button></form>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{customers.map((c:any)=>(<div key={c.id} className="bg-white p-6 rounded-2xl border shadow-sm"><h4 className="font-bold">{c.name}</h4><p className="text-sm text-gray-400">{c.phone}</p><p className="text-[10px] font-bold mt-2">TRN: {c.trn||'N/A'}</p></div>))}</div>
    </div>
  );
}

function SettingsModule({ settings, setSettings }: any) {
  const [l, setL] = useState(settings);
  const save = (e: any) => { e.preventDefault(); setSettings(l); alert("Settings Saved"); };
  return (
    <div className="bg-white p-8 rounded-2xl border max-w-2xl"><h3 className="text-xl font-bold mb-6">Settings</h3><form onSubmit={save} className="space-y-4"><input className="w-full p-3 border rounded-xl" value={l.companyName} onChange={e => setL({...l, companyName: e.target.value})} /><input className="w-full p-3 border rounded-xl text-right" value={l.companyNameArabic} onChange={e => setL({...l, companyNameArabic: e.target.value})} /><input className="w-full p-3 border rounded-xl" value={l.vatNumber} onChange={e => setL({...l, vatNumber: e.target.value})} /><textarea className="w-full p-3 border rounded-xl" value={l.address} onChange={e => setL({...l, address: e.target.value})} /><button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">Save All Settings</button></form></div>
  );
}

/**
 * InvoicePrint Component: Standard ZATCA style tax invoice to match the provided image exactly.
 */
function InvoicePrint({ sale, settings }: { sale: Sale; settings: AppSettings }) {
  // Generate a mock QR code URL representing ZATCA requirements (TLV format)
  const qrDataString = `Seller:${settings.companyName}|VAT:${settings.vatNumber}|Date:${sale.date}|Total:${sale.total.toFixed(2)}|VATTotal:${sale.vatAmount.toFixed(2)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrDataString)}`;

  return (
    <div className="bg-white p-4 text-[10px] font-sans leading-tight text-black border border-gray-300 w-[210mm] min-h-[297mm] mx-auto overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-2/3">
          <p className="font-black text-xs uppercase">SUPPLIERS DETAILS:</p>
          <div className="flex justify-between items-start">
            <div className="flex-1">
               <p className="font-black text-sm uppercase">{settings.companyName}</p>
            </div>
            <div className="flex-1 text-right">
               <p className="font-bold text-sm font-arabic" dir="rtl">{settings.companyNameArabic}</p>
            </div>
          </div>
          <p className="text-[8px] text-gray-600 mt-1 leading-tight">{settings.address}</p>
          <p className="text-[9px] mt-1 font-bold">Exice TRN: {settings.exciseTrn}</p>
          <p className="text-[9px] font-bold">VAT TRN: {settings.vatNumber}</p>
        </div>
        <div className="w-1/3 flex flex-col items-end">
          <img src={settings.logoUrl} alt="Logo" className="w-24 object-contain mb-2" />
          <div className="border p-1 bg-white">
            <img src={qrUrl} alt="QR Code" className="w-20 h-20" />
          </div>
        </div>
      </div>

      <h2 className="text-center font-black border-y py-1 mb-2 text-xs uppercase">Tax Invoice (فاتورة ضريبية)</h2>

      {/* DATES SECTION */}
      <div className="grid grid-cols-3 gap-0 border mb-2 text-center text-[8px]">
        <div className="border-r p-1">
          <p className="font-bold">Order Date (تاريخ الطلب):</p>
          <p>{new Date(sale.orderDate).toLocaleDateString()}</p>
        </div>
        <div className="border-r p-1">
          <p className="font-bold">Invoice Date (تاريخ الفاتورة):</p>
          <p>{new Date(sale.date).toLocaleDateString()}</p>
        </div>
        <div className="p-1">
          <p className="font-bold">Delivery Date (تاريخ التوصيل):</p>
          <p>{new Date(sale.deliveryDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* CUSTOMER DETAILS */}
      <div className="grid grid-cols-2 gap-0 border mb-2">
        <div className="border-r">
          <div className="bg-gray-100 p-1 border-b font-bold flex justify-between uppercase">
            <span>SHIP TO</span>
            <span dir="rtl" className="font-arabic">توريد لـ</span>
          </div>
          <div className="p-1 min-h-[40px]">
            <p className="font-bold uppercase">{sale.customerName}</p>
            <p className="text-[8px]">{sale.customerAddress}</p>
            <p className="text-[8px]">Mobile: {sale.mobile || sale.customerPhone || '-'}</p>
          </div>
        </div>
        <div>
          <div className="bg-gray-100 p-1 border-b font-bold flex justify-between uppercase">
            <span>BILL TO</span>
            <span dir="rtl" className="font-arabic">فاتورة لـ</span>
          </div>
          <div className="p-1 min-h-[40px]">
            <p className="font-bold uppercase">{sale.customerName}</p>
            <p className="text-[8px]">TRN: {sale.customerTrn || '-'}</p>
          </div>
        </div>
      </div>

      {/* INVOICE METADATA */}
      <div className="grid grid-cols-2 gap-0 border mb-2">
        <div className="border-r p-1 flex justify-between">
          <span className="font-bold">Tax Invoice No (رقم الفاتورة):</span>
          <span>{sale.invoiceNo}</span>
        </div>
        <div className="p-1 flex justify-between">
          <span className="font-bold">Supplier Ref. No:</span>
          <span>{sale.supplierRef || 'REF-' + sale.invoiceNo.split('-')[1]}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-0 border mb-2 text-center">
        <div className="border-r p-1">
          <p className="font-bold">PO No:</p>
          <p>{sale.poNo || '-'}</p>
        </div>
        <div className="border-r p-1">
          <p className="font-bold">PO Date:</p>
          <p>{sale.poDate || '-'}</p>
        </div>
        <div className="border-r p-1">
          <p className="font-bold">DM ID:</p>
          <p>{sale.dmId || 'DM00589'}</p>
        </div>
        <div className="p-1">
          <p className="font-bold">Vehicle No:</p>
          <p>{sale.vehicleNo || 'KZA-4177'}</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 border mb-2 text-center bg-gray-50 uppercase text-[7px] font-black leading-tight">
        <div className="border-r p-1">SALES MAN<br/><span dir="rtl" className="font-arabic">مندوب المبيعات</span></div>
        <div className="border-r p-1">MOBILE<br/></div>
        <div className="border-r p-1">EMIRATES<br/><span dir="rtl" className="font-arabic">عقودا</span></div>
        <div className="border-r p-1">SITE CODE<br/><span dir="rtl" className="font-arabic">رقم الفرع</span></div>
        <div className="border-r p-1">CUST CODE<br/><span dir="rtl" className="font-arabic">رقم العميل</span></div>
        <div className="border-r p-1">CURRENCY<br/><span dir="rtl" className="font-arabic">العملة</span></div>
        <div className="p-1">PAYMENT<br/><span dir="rtl" className="font-arabic">شروط السداد</span></div>
      </div>
      <div className="grid grid-cols-7 gap-0 border border-t-0 mb-2 text-center font-bold">
        <div className="border-r p-1 uppercase truncate px-0.5">{sale.salesMan}</div>
        <div className="border-r p-1">{sale.mobile || '-'}</div>
        <div className="border-r p-1">{sale.emirates || '-'}</div>
        <div className="border-r p-1">{sale.siteCode || '20400516'}</div>
        <div className="border-r p-1">{sale.custCode || '12008'}</div>
        <div className="border-r p-1">{sale.currency || 'SR'}</div>
        <div className="p-1">{sale.paymentType || 'Credit'}</div>
      </div>

      {/* ITEMS TABLE */}
      <div className="border mb-4 overflow-hidden rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[6.5px] font-black uppercase tracking-tighter text-center divide-x border-b">
              <th className="p-1 w-[15%]">ITEM CODE<br/><span dir="rtl" className="font-arabic">رمز الصنف</span></th>
              <th className="p-1 w-[6%]">UOM<br/><span dir="rtl" className="font-arabic">وحدة القياس</span></th>
              <th className="p-1 w-[12%]">Quantity<br/><span dir="rtl" className="font-arabic">الكمية</span><div className="flex justify-between px-1 border-t mt-1"><span>CTN</span><span>PCS</span></div></th>
              <th className="p-1 w-[8%]">CTN PRICE<br/><span dir="rtl" className="font-arabic">سعر الوحدة</span></th>
              <th className="p-1 w-[8%]">GROSS Amnt<br/><span dir="rtl" className="font-arabic">سعر الوحدة</span></th>
              <th className="p-1 w-[8%]">Total Excise Duty</th>
              <th className="p-1 w-[10%]">Discount<br/><span dir="rtl" className="font-arabic">نسبة الخصم</span><div className="flex justify-between px-1 border-t mt-1"><span>Dis%</span><span>DisVal</span></div></th>
              <th className="p-1 w-[6%]">VAT %</th>
              <th className="p-1 w-[8%]">VAT Amt</th>
              <th className="p-1 w-[12%]">Total Incl Excise + VAT</th>
            </tr>
          </thead>
          <tbody className="divide-y text-[7.5px] font-bold">
            {sale.items.map((item, idx) => {
              const uomVal = parseInt(item.uom || '24');
              const pcs = item.quantity % uomVal;
              return (
                <React.Fragment key={idx}>
                  {/* Description Row */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={10} className="px-1 py-0.5 border-b font-black text-gray-700">
                      <div className="flex justify-between items-center">
                         <span>{idx+1}. {item.productName}</span>
                         <span dir="rtl" className="font-arabic text-[9px]">(المنتج الغذائي)</span>
                      </div>
                    </td>
                  </tr>
                  {/* Data Row */}
                  <tr className="divide-x text-center h-5">
                    <td className="p-1">{item.productId}</td>
                    <td className="p-1">{item.uom}</td>
                    <td className="p-1">
                      <div className="flex justify-between px-2">
                         <span>{item.quantityCtn}</span>
                         <span>{pcs}</span>
                      </div>
                    </td>
                    <td className="p-1">{(item.grossAmount * uomVal).toFixed(2)}</td>
                    <td className="p-1">{item.grossAmount.toFixed(2)}</td>
                    <td className="p-1">{item.exciseDuty.toFixed(2)}</td>
                    <td className="p-1">
                      <div className="flex justify-between px-2">
                         <span>{item.discountPercent}</span>
                         <span>{item.discountVal}</span>
                      </div>
                    </td>
                    <td className="p-1">{item.vatPercent}</td>
                    <td className="p-1">{item.vatAmount.toFixed(2)}</td>
                    <td className="p-1 font-black">{item.totalIncl.toFixed(2)}</td>
                  </tr>
                </React.Fragment>
              );
            })}
            {/* Pad table */}
            {[...Array(Math.max(0, 10 - sale.items.length * 2))].map((_, i) => (
              <tr key={`empty-${i}`} className="h-6 divide-x border-t"><td colSpan={10}></td></tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-black text-[9px] text-center divide-x border-t">
            <tr>
              <td colSpan={2} className="p-1 text-right">TOTAL (المجموع)</td>
              <td className="p-1">{sale.items.reduce((a,c)=>a+c.quantityCtn,0)} CTN</td>
              <td className="p-1" colSpan={5}></td>
              <td className="p-1 text-right">SR {sale.vatAmount.toFixed(2)}</td>
              <td className="p-1 text-right">SR {sale.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* SUMMARY FOOTER */}
      <div className="flex justify-between mt-auto pt-10">
        <div className="w-1/2 space-y-4">
           <div className="border-t pt-2 w-48 text-center border-black">
              <p className="font-bold uppercase">Customer Signature</p>
              <p dir="rtl" className="font-arabic">توقيع العميل</p>
           </div>
        </div>
        <div className="w-1/2 flex flex-col items-end">
           <div className="border-t pt-2 w-48 text-center border-black">
              <p className="font-bold uppercase">Authorized Signature</p>
              <p dir="rtl" className="font-arabic">توقيع معتمد</p>
           </div>
        </div>
      </div>

      <div className="text-[7px] text-gray-400 mt-8 text-center font-bold">
        COMPUTER GENERATED INVOICE - NO SIGNATURE REQUIRED<br/>
        E&OE. ALL GOODS SOLD ARE NON-RETURNABLE.
      </div>
    </div>
  );
}
