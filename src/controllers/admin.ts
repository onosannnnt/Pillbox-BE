import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Medicine } from '../models/medicine'
import { LogHistory } from '../models/loghistory'
import { User } from '../models/user'

export class Admin {
  private medicineRepository = AppDataSource.getRepository(Medicine)
  private logRepository = AppDataSource.getRepository(LogHistory)
  private userRepository = AppDataSource.getRepository(User)
  constructor() {
    this.medicineRepository = AppDataSource.getRepository(Medicine)
    this.logRepository = AppDataSource.getRepository(LogHistory)
    this.userRepository = AppDataSource.getRepository(User)
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
  getWeeklyForgotAllUser = async (req: Request, res: Response) => {
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
        .addSelect('COUNT(log.user)', 'จำนวนครั้งที่ลืม')
        .where('log.task = :task', { task: 'forget' })
        .andWhere('log.createdAt >= :date', { date: new Date(new Date().setDate(new Date().getDate() - 6)) })
        .getRawMany()
      return res.json(logs)
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
        .addSelect('COUNT(log.user)', 'forget')
        .where('log.task = :task', { task: 'forget' })
        .orderBy('forget', 'DESC')
        .getRawMany()
      logs.map((log) => {
        log.forget = parseInt(log.forget)
      })
      return res.json(logs)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getLatestActive = async (req: Request, res: Response) => {
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
        .addSelect('MAX(log.createdAt)', 'latestActive')
        .orderBy('MAX(log.createdAt)', 'DESC')
        .getRawMany()
      return res.json(logs)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getAllUser = async (req: Request, res: Response) => {
    try {
      const users = await this.userRepository.find({
        where: { role: 'user' }
      })
      return res.json(users)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getUser = async (req: Request, res: Response) => {
    const { username } = req.params
    try {
      const user = await this.userRepository.findOne({
        where: { username: username }
      })
      return res.json(user)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  editUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, lineID, username, numberOfPillChannels } = req.body || ''
    const userID = req.params.userID
    try {
      const user = await this.userRepository.findOne({
        where: { id: userID }
      })
      user.firstName = firstName
      user.lastName = lastName
      user.email = email
      user.lineID = lineID
      user.username = username
      user.numberOfPillChannels = numberOfPillChannels
      await this.userRepository.save(user)
      return res.json({ message: 'แก้ไขข้อมูลผู้ใช้สำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
