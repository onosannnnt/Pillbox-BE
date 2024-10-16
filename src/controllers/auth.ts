import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User } from '../models/user'
import { cookiesConfig, jwtSecret, salt } from '../config/auth'
import { Repository } from 'typeorm'
import { USER_ID } from '../config/constance'

export class Auth {
  private userRepository: Repository<User>
  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
  }

  getUserData = async (req: Request, res: Response) => {
    const { emailOrUsername } = req.params
    try {
      const user = await this.userRepository.findOne({
        select: ['id', 'email', 'username', 'role', 'lineID', 'numberOfPillChannels'],
        where: [{ email: emailOrUsername }, { username: emailOrUsername }]
      })
      if (!user) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้' })
      }
      return res.send(user)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }

  login = async (req: Request, res: Response) => {
    const { emailOrUsername, password } = req.body
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบถ้วน' })
    }
    try {
      const user = await this.userRepository.findOne({
        where: [{ email: emailOrUsername }, { username: emailOrUsername }]
      })
      if (!user) {
        return res.status(404).json({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' })
      }
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' })
      return res.cookie('token', token, cookiesConfig).json({ message: 'เข้าสู่ระบบสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      return res.clearCookie('token').json({ message: 'ออกจากระบบสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }

  register = async (req: Request, res: Response) => {
    const { email, username, password, role } = req.body
    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
    }
    if (role === 'user' && !req.body.lineID && !req.body.numberOfPillChannels) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
    } else if (role === 'admin') {
      req.body.lineID = ''
      req.body.numberOfPillChannels = 0
    }
    const { lineID, numberOfPillChannels } = req.body
    try {
      const user = new User()
      user.email = email
      user.username = username
      user.password = await bcrypt.hash(password, salt)
      user.lineID = lineID
      user.role = role
      user.numberOfPillChannels = numberOfPillChannels
      await this.userRepository.save(user)
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' })
      return res.status(201).cookie('token', token, cookiesConfig).json({ message: 'สร้างบัญชีผู้ใช้สำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  me = async (req: Request, res: Response) => {
    try {
      const user = await this.userRepository.findOne({
        select: ['email', 'username', 'role', 'lineID', 'numberOfPillChannels'],
        where: { id: req[USER_ID] }
      })
      return res.json(user)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
