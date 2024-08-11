import { Router } from 'express'
import { addMedicine } from '../controllers/admin/addmedicine'
import { isAdmin, isExist } from '../middleware/auth'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello from admin route')
})

router.post('/addMedicine', isExist, isAdmin, addMedicine)

export default router
