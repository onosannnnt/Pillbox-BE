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
router.get('/getLatestActive', Middleware.isExist, Middleware.isAdmin, AdminController.getLatestActive)
router.get('/getAllUser', Middleware.isExist, Middleware.isAdmin, AdminController.getAllUser)
router.get('/getUser/:username', Middleware.isExist, Middleware.isAdmin, AdminController.getUser)
router.put('/editUser/:userID', Middleware.isExist, Middleware.isAdmin, AdminController.editUser)
router.get('/getUserTotalLog/:username', Middleware.isExist, Middleware.isAdmin, AdminController.getUserTotalLog)
router.get('/getUserPillChannel/:username', Middleware.isExist, Middleware.isAdmin, AdminController.getUserPillChannel)
router.get('/getUserHistory/:username', Middleware.isExist, Middleware.isAdmin, AdminController.getUserHistory)

export default router
