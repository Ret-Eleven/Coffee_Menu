import { Router } from 'express'
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',     authenticate, getCustomers)
router.get('/:id',  authenticate, getCustomer)
router.post('/',    authenticate, createCustomer)
router.put('/:id',  authenticate, updateCustomer)
router.delete('/:id', authenticate, authorize('admin','manager'), deleteCustomer)
export default router
