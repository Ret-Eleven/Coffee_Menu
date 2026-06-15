import { Router } from 'express'
import { login, register, me, changePassword } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.post('/login',           login)
router.post('/register',        register)
router.get('/me',               authenticate, me)
router.put('/change-password',  authenticate, changePassword)
export default router
