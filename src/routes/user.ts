import { Auth } from './../controllers/auth'
import { middleware } from './../middleware/auth'
import { Router } from 'express'
import { User } from '../controllers/user'
const router = Router()

const AuthController = new Auth()
const Middleware = new middleware()
const UserController = new User()

router.get('/', (req, res) => {
  res.send('Hello from user route')
})

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/logout', Middleware.isExist, AuthController.logout)
router.get('/pillboxLogin/:emailOrUsername', AuthController.getUserData)
router.get('/me', Middleware.isExist, AuthController.me)

router.post('/addHistory', Middleware.isExist, UserController.addHistory)

export default router
