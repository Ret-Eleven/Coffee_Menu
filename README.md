# ☕ Coffee Haven — Coffee Shop Management System

A full-stack coffee shop management web application built with **React + Vite** (frontend) and **Node.js + Express** (backend), with **MySQL** database and **JWT** authentication.

---

## 🖥️ Pages & Features

| Page | Features |
|------|----------|
| **Dashboard** | Revenue charts, best sellers, recent orders overview |
| **Menu Management** | Products & categories, CRUD, image upload, status toggle |
| **Order Management** | Order creation, status tracking, detail modal |
| **Customer Management** | Profiles, membership tiers (Bronze → Platinum) |
| **Inventory Management** | Stock tracking, low-stock alerts, supplier info |
| **Employee Management** | Staff profiles, roles, hire dates, CRUD |
| **Reports & Analytics** | Revenue/order charts (Bar, Line, Pie), product ranking |
| **Promotions** | Coupon codes, discount cards, activate/deactivate |
| **Settings** | Shop info, payments, role permissions, security |
| **Authentication** | Login, Register, Forgot Password with JWT |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Axios
- Recharts (charts)
- Lucide React (icons)
- react-hot-toast (notifications)

**Backend**
- Node.js + Express
- MySQL2
- JWT + bcryptjs (auth)
- Multer (file uploads)
- Helmet + Morgan (security/logging)

**Auth**
- JWT Bearer tokens
- Role-based access control: `admin` / `manager` / `staff`

---

## 📁 Project Structure

```
Coffee_Menu/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # 10 page components
│   │   ├── components/       # Sidebar, Header layout
│   │   ├── context/          # AuthContext (JWT)
│   │   ├── services/         # Axios API instance
│   │   └── utils/            # Mock data fallback
│   └── vite.config.js
├── server/                   # Express backend
│   └── src/
│       ├── controllers/      # Business logic (10 controllers)
│       ├── routes/           # REST API routes
│       ├── middleware/       # Auth, file upload
│       └── database/         # schema.sql + db pool
├── package.json              # Root: concurrent dev scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Ret-Eleven/Coffee_Menu.git
cd Coffee_Menu
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Set up MySQL database
```bash
mysql -u root -p < server/src/database/schema.sql
```

### 4. Configure environment variables
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coffee_haven
JWT_SECRET=your_secret_key
```

### 5. Run the app
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |

---

## 🔑 Demo Login (works without backend)

The app runs fully on mock data if no backend is available.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coffeehaven.com | admin123 |
| Manager | manager@coffeehaven.com | admin123 |
| Staff | staff@coffeehaven.com | admin123 |

---

## 📡 API Endpoints

| Resource | Base Path |
|----------|-----------|
| Auth | `POST /api/auth/login` |
| Dashboard | `GET /api/dashboard/summary` |
| Menu | `GET/POST/PUT/DELETE /api/menu/products` |
| Orders | `GET/POST/PATCH /api/orders` |
| Customers | `GET/POST/PUT/DELETE /api/customers` |
| Inventory | `GET/POST/PUT/DELETE /api/inventory` |
| Employees | `GET/POST/PUT/DELETE /api/employees` |
| Reports | `GET /api/reports/sales` |
| Promotions | `GET/POST/PUT/DELETE /api/promotions` |
| Settings | `GET/PUT /api/settings` |

---

## 📸 Role Permissions

| Permission | Admin | Manager | Staff |
|------------|-------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| Manage Menu | ✅ | ✅ | ❌ |
| Create Orders | ✅ | ✅ | ✅ |
| View Reports | ✅ | ✅ | ❌ |
| Manage Employees | ✅ | ❌ | ❌ |
| Access Settings | ✅ | ❌ | ❌ |

---

## 📄 License

MIT License — free to use and modify.
