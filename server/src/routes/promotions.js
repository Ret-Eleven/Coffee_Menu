import { Router } from 'express'
import { getPromotions, createPromotion, updatePromotion, deletePromotion, validateCoupon } from '../controllers/promotionController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',           authenticate, getPromotions)
router.post('/',          authenticate, authorize('admin','manager'), createPromotion)
router.put('/:id',        authenticate, authorize('admin','manager'), updatePromotion)
router.delete('/:id',     authenticate, authorize('admin'), deletePromotion)
router.post('/validate',  authenticate, validateCoupon)
export default router
