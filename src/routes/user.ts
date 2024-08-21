import { middleware } from './../middleware/auth'
import { Router } from 'express'
import { History } from '../controllers/user/addhistory'
import { UserController } from '../controllers/auth'
const router = Router()

const userController = new UserController()
const Middleware = new middleware()
const HistoryController = new History()

router.get('/', (req, res) => {
  res.send('Hello from user route')
})

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/logout', Middleware.isExist, userController.logout)
router.get('/pillboxLogin/:emailOrUsername', userController.getUserData)
router.get('/me', Middleware.isExist, userController.me)

router.post('/addHistory', Middleware.isExist, HistoryController.addHistory)

export default router
