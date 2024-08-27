import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../data-source'
import { User } from '../models/user'
import { Repository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import { ROLE_TYPE, USER_ID } from '../config/constance'

export class middleware {
  private userRepository: Repository<User>
  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
  }

  isExist = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' })
    }
    try {
      const payload = await jwt.verify(token, process.env.JWT_SECRET)
      const user = await this.userRepository.findOne({
        where: { id: payload.id }
      })
      if (!user) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้' })
      }
      req[USER_ID] = user.id
      req[ROLE_TYPE] = user.role
      next()
    } catch (error) {
      return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ', error: error.message })
    }
  }

  isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req[ROLE_TYPE] !== 'admin') {
        return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึง' })
      }
      next()
    } catch (error) {
      return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' })
    }
  }
}
