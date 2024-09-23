import { Admin } from '../controllers/admin'
import { Router } from 'express'
import { middleware } from '../middleware/auth'

const router = Router()

const Middleware = new middleware()
const AdminController = new Admin()

router.get('/', (req, res) => {
  res.send('Hello from admin route')
})

router.post('/addMedicine', Middleware.isExist, Middleware.isAdmin, AdminController.addMedicine)
router.get('/getWeeklyForgotAllUser', Middleware.isExist, Middleware.isAdmin, AdminController.getWeeklyForgotAllUser)
router.get('/getAllForgetHistory', Middleware.isExist, Middleware.isAdmin, AdminController.getAllForgetHistory)

export default router
