/* Demo data — used when no backend is connected */

export const mockStats = {
  daily_revenue: 1284.50,
  daily_orders: 47,
  total_customers: 382,
  total_products: 38,
  pending_orders: 6,
  monthly: [
    { month: '2026-01', revenue: 28400, orders: 890 },
    { month: '2026-02', revenue: 31200, orders: 976 },
    { month: '2026-03', revenue: 29800, orders: 932 },
    { month: '2026-04', revenue: 34100, orders: 1067 },
    { month: '2026-05', revenue: 37600, orders: 1175 },
    { month: '2026-06', revenue: 41200, orders: 1288 },
  ],
  best_sellers: [
    { name: 'Vanilla Latte',      total_sold: 312, revenue: 1404.00 },
    { name: 'Classic Cappuccino', total_sold: 278, revenue: 1112.00 },
    { name: 'Caramel Mocha',      total_sold: 245, revenue: 1225.00 },
    { name: 'Butter Croissant',   total_sold: 198, revenue:  544.50 },
    { name: 'Green Tea Latte',    total_sold: 176, revenue:  739.20 },
  ],
  recent_orders: [
    { id:1, order_number:'ORD-K8X2P', customer_name:'Alice Johnson', total: 12.50, status:'completed', created_at:'2026-06-15T09:22:00' },
    { id:2, order_number:'ORD-M3Q7R', customer_name:'Bob Smith',     total:  8.75, status:'preparing', created_at:'2026-06-15T09:18:00' },
    { id:3, order_number:'ORD-T5N1L', customer_name:'Carol White',   total: 21.00, status:'pending',   created_at:'2026-06-15T09:10:00' },
    { id:4, order_number:'ORD-P9W4S', customer_name:'David Lee',     total: 15.25, status:'completed', created_at:'2026-06-15T08:55:00' },
    { id:5, order_number:'ORD-A2C6T', customer_name:'Eve Turner',    total:  6.50, status:'cancelled', created_at:'2026-06-15T08:40:00' },
  ],
}

export const mockCategories = [
  { id:1, name:'Espresso',   icon:'☕', color:'#2C1810' },
  { id:2, name:'Latte',      icon:'🥛', color:'#8B5E3C' },
  { id:3, name:'Cappuccino', icon:'☁️', color:'#C8832A' },
  { id:4, name:'Mocha',      icon:'🍫', color:'#4A2C2A' },
  { id:5, name:'Americano',  icon:'🫗', color:'#6B3A2A' },
  { id:6, name:'Tea',        icon:'🍵', color:'#2D7A4A' },
  { id:7, name:'Smoothies',  icon:'🥤', color:'#7B3FA0' },
  { id:8, name:'Pastries',   icon:'🥐', color:'#B85C00' },
]

export const mockProducts = [
  { id:1, category_id:1, category_name:'Espresso', name:'Single Espresso',   price:2.50, stock:99, status:'available', has_sizes:0, emoji:'☕' },
  { id:2, category_id:1, category_name:'Espresso', name:'Double Espresso',   price:3.50, stock:99, status:'available', has_sizes:0, emoji:'☕' },
  { id:3, category_id:2, category_name:'Latte',    name:'Vanilla Latte',     price:4.50, stock:50, status:'available', has_sizes:1, emoji:'🥛' },
  { id:4, category_id:2, category_name:'Latte',    name:'Caramel Latte',     price:4.75, stock:45, status:'available', has_sizes:1, emoji:'🥛' },
  { id:5, category_id:3, category_name:'Cappuccino', name:'Classic Cappuccino', price:4.00, stock:60, status:'available', has_sizes:1, emoji:'☁️' },
  { id:6, category_id:4, category_name:'Mocha',    name:'Caramel Mocha',     price:5.00, stock:40, status:'available', has_sizes:1, emoji:'🍫' },
  { id:7, category_id:6, category_name:'Tea',      name:'Green Tea Latte',   price:4.20, stock:35, status:'available', has_sizes:1, emoji:'🍵' },
  { id:8, category_id:8, category_name:'Pastries', name:'Butter Croissant',  price:2.75, stock:20, status:'available', has_sizes:0, emoji:'🥐' },
  { id:9, category_id:8, category_name:'Pastries', name:'Cinnamon Roll',     price:3.50, stock: 8, status:'available', has_sizes:0, emoji:'🌀' },
  { id:10,category_id:7, category_name:'Smoothies',name:'Berry Blast',       price:5.50, stock:25, status:'available', has_sizes:1, emoji:'🫐' },
]

export const mockOrders = [
  { id:1,  order_number:'ORD-K8X2P', customer_name:'Alice Johnson', total:12.50, status:'completed', payment_method:'card',    created_at:'2026-06-15T09:22:00' },
  { id:2,  order_number:'ORD-M3Q7R', customer_name:'Bob Smith',     total: 8.75, status:'preparing', payment_method:'cash',    created_at:'2026-06-15T09:18:00' },
  { id:3,  order_number:'ORD-T5N1L', customer_name:'Carol White',   total:21.00, status:'pending',   payment_method:'digital', created_at:'2026-06-15T09:10:00' },
  { id:4,  order_number:'ORD-P9W4S', customer_name:'David Lee',     total:15.25, status:'completed', payment_method:'card',    created_at:'2026-06-15T08:55:00' },
  { id:5,  order_number:'ORD-A2C6T', customer_name:'Eve Turner',    total: 6.50, status:'cancelled', payment_method:'cash',    created_at:'2026-06-15T08:40:00' },
  { id:6,  order_number:'ORD-B4D8U', customer_name:'Frank Brown',   total:18.75, status:'completed', payment_method:'card',    created_at:'2026-06-15T08:20:00' },
  { id:7,  order_number:'ORD-C6F0V', customer_name:'Grace Kim',     total: 9.00, status:'ready',     payment_method:'digital', created_at:'2026-06-15T08:05:00' },
  { id:8,  order_number:'ORD-D7G1W', customer_name:'Henry Chen',    total:24.50, status:'completed', payment_method:'card',    created_at:'2026-06-15T07:50:00' },
]

export const mockCustomers = [
  { id:1, name:'Alice Johnson', email:'alice@email.com', phone:'555-0101', membership:'gold',     loyalty_points:1250, total_spent: 842.50, created_at:'2024-03-15' },
  { id:2, name:'Bob Smith',     email:'bob@email.com',   phone:'555-0102', membership:'silver',   loyalty_points: 620, total_spent: 421.00, created_at:'2024-05-20' },
  { id:3, name:'Carol White',   email:'carol@email.com', phone:'555-0103', membership:'platinum', loyalty_points:3400, total_spent:2180.00, created_at:'2023-11-08' },
  { id:4, name:'David Lee',     email:'david@email.com', phone:'555-0104', membership:'bronze',   loyalty_points: 180, total_spent: 125.75, created_at:'2025-01-12' },
  { id:5, name:'Eve Turner',    email:'eve@email.com',   phone:'555-0105', membership:'gold',     loyalty_points:1820, total_spent:1240.00, created_at:'2024-07-03' },
]

export const mockInventory = [
  { id:1, name:'Ethiopian Arabica Beans', category:'Coffee Beans', unit:'kg',  quantity:48.5, min_quantity:10, cost_per_unit:22.00, supplier:'Bean Masters Co.', supplier_contact:'beans@bm.com' },
  { id:2, name:'Colombian Blend',         category:'Coffee Beans', unit:'kg',  quantity: 8.2, min_quantity:10, cost_per_unit:18.50, supplier:'Bean Masters Co.', supplier_contact:'beans@bm.com' },
  { id:3, name:'Whole Milk',              category:'Dairy',        unit:'L',   quantity:32.0, min_quantity:15, cost_per_unit: 1.20, supplier:'Farm Fresh Dairy',  supplier_contact:'info@ffd.com' },
  { id:4, name:'Oat Milk',               category:'Dairy',        unit:'L',   quantity: 6.5, min_quantity: 8, cost_per_unit: 2.40, supplier:'Green Oats Inc.',   supplier_contact:'sales@go.com' },
  { id:5, name:'Vanilla Syrup',          category:'Syrups',       unit:'bottle', quantity:12, min_quantity: 5, cost_per_unit: 8.00, supplier:'Flavor World',     supplier_contact:'fw@fw.com'   },
  { id:6, name:'Caramel Sauce',          category:'Syrups',       unit:'bottle', quantity: 3, min_quantity: 5, cost_per_unit: 7.50, supplier:'Flavor World',     supplier_contact:'fw@fw.com'   },
  { id:7, name:'Croissants (frozen)',    category:'Pastries',     unit:'pcs', quantity:40,   min_quantity:20, cost_per_unit: 1.80, supplier:'Bakery Direct',    supplier_contact:'bd@bd.com'   },
  { id:8, name:'Paper Cups (8oz)',       category:'Packaging',    unit:'pcs', quantity:180,  min_quantity:100, cost_per_unit:.05,  supplier:'Pack Supply Co.',  supplier_contact:'ps@ps.com'   },
]

export const mockEmployees = [
  { id:1, name:'Admin User',   email:'admin@coffeehaven.com',   role:'admin',   phone:'555-9001', status:'active', hire_date:'2023-01-01' },
  { id:2, name:'Jane Manager', email:'manager@coffeehaven.com', role:'manager', phone:'555-9002', status:'active', hire_date:'2023-03-15' },
  { id:3, name:'Bob Staff',    email:'staff@coffeehaven.com',   role:'staff',   phone:'555-9003', status:'active', hire_date:'2023-06-01' },
  { id:4, name:'Sara Barista', email:'sara@coffeehaven.com',    role:'staff',   phone:'555-9004', status:'active', hire_date:'2024-02-10' },
  { id:5, name:'Tom Shift',    email:'tom@coffeehaven.com',     role:'staff',   phone:'555-9005', status:'inactive', hire_date:'2023-09-20' },
]

export const mockPromotions = [
  { id:1, title:'Summer Latte Special', type:'percentage', value:20, code:'LATTE20', min_order:0,  max_uses:500, used_count:127, start_date:'2026-06-01', end_date:'2026-08-31', status:'active'   },
  { id:2, title:'Loyalty Reward',       type:'fixed',      value:5,  code:'LOYAL5',  min_order:20, max_uses:200, used_count:88,  start_date:'2026-05-01', end_date:'2026-12-31', status:'active'   },
  { id:3, title:'Grand Opening',        type:'percentage', value:15, code:'OPEN15',  min_order:0,  max_uses:1000,used_count:1000,start_date:'2023-01-01', end_date:'2023-01-31', status:'expired'  },
  { id:4, title:'Weekend Pastry Deal',  type:'percentage', value:10, code:'PASTRY10',min_order:10, max_uses:null,used_count:42,  start_date:'2026-06-01', end_date:'2026-09-30', status:'active'   },
]
