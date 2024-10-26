import { Auth } from './../controllers/auth'
import { middleware } from './../middleware/auth'
import { Router } from 'express'
import { User } from '../controllers/user'
import { Pillbox } from '../controllers/pillbox'
const router = Router()

const AuthController = new Auth()
const Middleware = new middleware()
const UserController = new User()
const PillboxController = new Pillbox()

router.get('/', (req, res) => {
  res.send('Hello from user route')
})

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/logout', Middleware.isExist, AuthController.logout)
router.get('/pillboxLogin/:emailOrUsername', AuthController.getUserData)
router.get('/me', Middleware.isExist, AuthController.me)

// web frontend
router.get('/getHistory', Middleware.isExist, UserController.getHistory)
router.get('/getPillChannels', Middleware.isExist, PillboxController.getPillChannel)
router.get('/getPillChannel/:channelID', Middleware.isExist, PillboxController.getChannelData)
router.get('/getForgetHistory', Middleware.isExist, UserController.getForgetHistory)

// hardware
router.post('/addHistory', UserController.addHistory)
router.post('/addPillChannel', PillboxController.addPillChannel)
router.get('/hardwareGetPillChannels/:userID', PillboxController.hardwareGetPillChannel)
router.put('/userTakePill/:channelID', PillboxController.takePill)
router.get('/getMedicines', PillboxController.getMedicine)
router.delete('/deletePillChannel/:channelID', PillboxController.deletePillChannel)
router.put('updatePillChannel/:channelID', PillboxController.updatePillChannel)

export default router
