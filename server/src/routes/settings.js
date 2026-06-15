import { Router } from 'express'
import { getSettings, updateSettings } from '../controllers/settingsController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.get('/',  authenticate, getSettings)
router.put('/',  authenticate, authorize('admin'), updateSettings)
export default router
