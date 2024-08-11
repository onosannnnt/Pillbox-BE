import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User } from '../models/user'
import { cookiesConfig, jwtSecret, salt } from '../config/auth'
import { Repository } from 'typeorm'

export class UserController {
  private userRepository: Repository<User>
  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
  }

  getUserData = async (req: Request, res: Response) => {
    const { emailOrUsername } = req.body
    try {
      const user = await this.userRepository.findOne({
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
        return res.status(400).json({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' })
      }
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
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
    const { email, username, password, lineID, role, numberOfPillChannels } = req.body
    if (!email || !username || !password || !lineID || !role || !numberOfPillChannels) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
    }
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
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
      const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' })
      return res.cookie('token', token, cookiesConfig).json({ message: 'สร้างบัญชีผู้ใช้สำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
