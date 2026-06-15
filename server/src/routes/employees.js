import { Router } from 'express'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()
router.get('/',     authenticate, authorize('admin','manager'), getEmployees)
router.post('/',    authenticate, authorize('admin'), upload.single('avatar'), createEmployee)
router.put('/:id',  authenticate, authorize('admin','manager'), upload.single('avatar'), updateEmployee)
router.delete('/:id', authenticate, authorize('admin'), deleteEmployee)
export default router
