import { Router } from 'express'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../controllers/menuController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()
router.get('/categories',     authenticate, getCategories)
router.get('/',               authenticate, getProducts)
router.post('/',              authenticate, authorize('admin','manager'), upload.single('image'), createProduct)
router.put('/:id',            authenticate, authorize('admin','manager'), upload.single('image'), updateProduct)
router.delete('/:id',         authenticate, authorize('admin','manager'), deleteProduct)
export default router
