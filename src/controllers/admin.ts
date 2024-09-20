import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Medicine } from '../models/medicine'
import { LogHistory } from '../models/loghistory'

export class Admin {
  private medicineRepository = AppDataSource.getRepository(Medicine)
  private logRepository = AppDataSource.getRepository(LogHistory)
  constructor() {
    this.medicineRepository = AppDataSource.getRepository(Medicine)
  }
  addMedicine = async (req: Request, res: Response) => {
    const { name, description, note, img } = req.body || ''
    try {
      const medicine = new Medicine()
      medicine.name = name
      medicine.description = description
      medicine.note = note
      medicine.img = img
      await this.medicineRepository.save(medicine)
      return res.json({ message: 'เพิ่มข้อมูลยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getAllForgetHistory = async (req: Request, res: Response) => {
    try {
      const logs = await this.logRepository
        .createQueryBuilder('log')
        .leftJoinAndSelect('log.user', 'user')
        .groupBy('user.username')
        .addGroupBy('log.user')
        .addGroupBy('user.firstName')
        .select('user.username')
        .addSelect('user.firstName', 'firstName')
        .addSelect('log.user', 'user')
        .addSelect('COUNT(log.user)', 'count')
        .where('log.task = :task', { task: 'forget' })
        .andWhere('log.createdAt >= :date', { date: new Date(new Date().setDate(new Date().getDate() - 7)) })
        .getRawMany()
      return res.json(logs)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getSingleForgetHistory = async (req: Request, res: Response) => {
    try {
      const logs = await this.logRepository
        .createQueryBuilder('log')
        .leftJoinAndSelect('log.user', 'user')
        .groupBy('user.username')
        .addGroupBy('log.user')
        .select('user.username')
        .addSelect('log.user', 'user')
        .addSelect('COUNT(log.user)', 'count')
        .where('log.task = :task', { task: 'forget' })
        .andWhere('log.createdAt >= :date', { date: new Date(new Date().setDate(new Date().getDate() - 7)) })
        .getRawMany()
      return res.json(logs)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
