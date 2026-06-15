import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes       from './routes/auth.js'
import dashboardRoutes  from './routes/dashboard.js'
import menuRoutes       from './routes/menu.js'
import orderRoutes      from './routes/orders.js'
import customerRoutes   from './routes/customers.js'
import inventoryRoutes  from './routes/inventory.js'
import employeeRoutes   from './routes/employees.js'
import reportRoutes     from './routes/reports.js'
import promotionRoutes  from './routes/promotions.js'
import settingsRoutes   from './routes/settings.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

app.use('/api/auth',       authRoutes)
app.use('/api/dashboard',  dashboardRoutes)
app.use('/api/menu',       menuRoutes)
app.use('/api/orders',     orderRoutes)
app.use('/api/customers',  customerRoutes)
app.use('/api/inventory',  inventoryRoutes)
app.use('/api/employees',  employeeRoutes)
app.use('/api/reports',    reportRoutes)
app.use('/api/promotions', promotionRoutes)
app.use('/api/settings',   settingsRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'Coffee Haven API' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`☕  Coffee Haven API running on port ${PORT}`))

export default app
