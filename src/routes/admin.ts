import { Router } from 'express'
import { addMedicine } from '../controllers/admin/addmedicine'
import { middleware } from '../middleware/auth'

const router = Router()

const Middleware = new middleware()

router.get('/', (req, res) => {
  res.send('Hello from admin route')
})

router.post('/addMedicine', Middleware.isExist, Middleware.isAdmin, addMedicine)

export default router
