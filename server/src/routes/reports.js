import { Router } from 'express'
import { getSalesReport, getProductReport, getCustomerReport } from '../controllers/reportController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/sales',     authenticate, authorize('admin','manager'), getSalesReport)
router.get('/products',  authenticate, authorize('admin','manager'), getProductReport)
router.get('/customers', authenticate, authorize('admin','manager'), getCustomerReport)
export default router
