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
    const { task, medicine, userID } = req.body
    try {
      const log = new LogHistory()
      log.task = task
      log.user = userID
      log.medicine = medicine
      await this.logRepository.save(log)
      return res.json({ message: 'เพิ่มประวัติการใช้ยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }

  getHistory = async (req: Request, res: Response) => {
    try {
      const userID = req[USER_ID]
      const logs = await this.logRepository.find({
        where: {
          user: {
            id: userID
          }
        },
        relations: {
          medicine: true
        },
        order: {
          createdAt: 'DESC'
        }
      })
      return res.json(logs)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getForgetHistory = async (req: Request, res: Response) => {
    try {
      const userID = req[USER_ID]
      const logs = await this.logRepository
        .createQueryBuilder('log')
        .leftJoinAndSelect('log.medicine', 'medicine')
        .where('log.user = :userID', { userID })
        .andWhere('log.task = :task', { task: 'forget' })
        .andWhere('log.createdAt >= :date', { date: new Date(new Date().setDate(new Date().getDate() - 7)) })
        .getMany()
      return res.json(logs)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
