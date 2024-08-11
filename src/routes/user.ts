import { Router } from 'express'
import { isExist } from '../middleware/auth'
import { addHistory } from '../controllers/user/addhistory'
import { UserController } from '../controllers/auth'
const router = Router()

const userController = new UserController()

router.get('/', (req, res) => {
  res.send('Hello from user route')
})

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/logout', isExist, userController.logout)
router.get('/getUserData', userController.getUserData)

router.post('/addHistory', isExist, addHistory)

export default router
