import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { LogHistory } from '../models/loghistory'
import { Repository } from 'typeorm'
import { USER_ID } from '../config/constance'

export class User {
  private logRepository: Repository<LogHistory>
  constructor() {
    this.logRepository = AppDataSource.getRepository(LogHistory)
  }

  addHistory = async (req: Request, res: Response) => {
    const { task, medicine } = req.body
    try {
      const log = new LogHistory()
      log.task = task
      log.user = req[USER_ID]
      log.medicine = medicine
      await this.logRepository.save(log)
      return res.json({ message: 'เพิ่มประวัติการใช้ยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
