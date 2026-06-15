-- Coffee Haven Database Schema

CREATE DATABASE IF NOT EXISTS coffee_haven CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coffee_haven;

-- Users / Employees
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','manager','staff') DEFAULT 'staff',
  phone       VARCHAR(20),
  avatar      VARCHAR(255),
  status      ENUM('active','inactive') DEFAULT 'active',
  hire_date   DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(80) NOT NULL UNIQUE,
  icon  VARCHAR(10),
  color VARCHAR(20)
);

-- Menu Products
CREATE TABLE products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  category_id  INT,
  name         VARCHAR(150) NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  image        VARCHAR(255),
  has_sizes    TINYINT(1) DEFAULT 0,
  stock        INT DEFAULT 0,
  status       ENUM('available','unavailable','discontinued') DEFAULT 'available',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Customers
CREATE TABLE customers (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) UNIQUE,
  phone           VARCHAR(20),
  address         TEXT,
  loyalty_points  INT DEFAULT 0,
  membership      ENUM('bronze','silver','gold','platinum') DEFAULT 'bronze',
  total_spent     DECIMAL(12,2) DEFAULT 0.00,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  customer_id   INT,
  order_number  VARCHAR(20) NOT NULL UNIQUE,
  status        ENUM('pending','preparing','ready','completed','cancelled') DEFAULT 'pending',
  payment_method ENUM('cash','card','digital') DEFAULT 'cash',
  subtotal      DECIMAL(10,2) DEFAULT 0.00,
  tax           DECIMAL(10,2) DEFAULT 0.00,
  discount      DECIMAL(10,2) DEFAULT 0.00,
  total         DECIMAL(10,2) DEFAULT 0.00,
  notes         TEXT,
  served_by     INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (served_by)   REFERENCES users(id)     ON DELETE SET NULL
);

-- Order Items
CREATE TABLE order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL,
  product_id  INT,
  product_name VARCHAR(150),
  size        ENUM('S','M','L'),
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Inventory
CREATE TABLE inventory (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  category      VARCHAR(80),
  unit          VARCHAR(30),
  quantity      DECIMAL(10,2) DEFAULT 0,
  min_quantity  DECIMAL(10,2) DEFAULT 0,
  cost_per_unit DECIMAL(10,2) DEFAULT 0,
  supplier      VARCHAR(150),
  supplier_contact VARCHAR(100),
  last_restocked TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Promotions
CREATE TABLE promotions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150) NOT NULL,
  description   TEXT,
  type          ENUM('percentage','fixed','buy_x_get_y','free_item') DEFAULT 'percentage',
  value         DECIMAL(10,2) DEFAULT 0,
  code          VARCHAR(50) UNIQUE,
  min_order     DECIMAL(10,2) DEFAULT 0,
  max_uses      INT,
  used_count    INT DEFAULT 0,
  start_date    DATE,
  end_date      DATE,
  status        ENUM('active','inactive','expired') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings
CREATE TABLE settings (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  `key`   VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  type  VARCHAR(30) DEFAULT 'string'
);

-- Seed: Categories
INSERT INTO categories (name, icon, color) VALUES
  ('Espresso',   '☕', '#2C1810'),
  ('Latte',      '🥛', '#8B5E3C'),
  ('Cappuccino', '☁️', '#C8832A'),
  ('Mocha',      '🍫', '#4A2C2A'),
  ('Americano',  '🫗', '#6B3A2A'),
  ('Tea',        '🍵', '#2D7A4A'),
  ('Smoothies',  '🥤', '#7B3FA0'),
  ('Pastries',   '🥐', '#B85C00');

-- Seed: Admin user (password: admin123)
INSERT INTO users (name, email, password, role, status, hire_date) VALUES
  ('Admin User', 'admin@coffeehaven.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', '2023-01-01'),
  ('Jane Manager', 'manager@coffeehaven.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'active', '2023-03-15'),
  ('Bob Staff', 'staff@coffeehaven.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active', '2023-06-01');

-- Seed: Default Settings
INSERT INTO settings (`key`, value, type) VALUES
  ('shop_name', 'Coffee Haven', 'string'),
  ('shop_address', '123 Brew Street, Coffee City', 'string'),
  ('shop_phone', '+1 555-COFFEE', 'string'),
  ('shop_email', 'hello@coffeehaven.com', 'string'),
  ('currency', 'USD', 'string'),
  ('tax_rate', '8', 'number'),
  ('loyalty_rate', '10', 'number');
