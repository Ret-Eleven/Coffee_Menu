import { Router } from 'express'
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../controllers/inventoryController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',     authenticate, getInventory)
router.post('/',    authenticate, authorize('admin','manager'), createInventoryItem)
router.put('/:id',  authenticate, authorize('admin','manager'), updateInventoryItem)
router.delete('/:id', authenticate, authorize('admin'), deleteInventoryItem)
export default router
