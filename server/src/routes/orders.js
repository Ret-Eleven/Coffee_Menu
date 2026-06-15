import { Router } from 'express'
import { getOrders, getOrder, createOrder, updateOrderStatus } from '../controllers/orderController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.get('/',        authenticate, getOrders)
router.get('/:id',     authenticate, getOrder)
router.post('/',       authenticate, createOrder)
router.patch('/:id',   authenticate, updateOrderStatus)
export default router
