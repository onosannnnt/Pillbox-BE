import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import { PillChannel } from '../models/pillChannel'
import { USER_ID } from '../config/constance'
import { Time } from '../models/time'
import { Medicine } from '../models/medicine'

export class Pillbox {
  private pillChannelRepository = AppDataSource.getRepository(PillChannel)
  private timeRepository = AppDataSource.getRepository(Time)
  private medicineRepository = AppDataSource.getRepository(Medicine)
  constructor() {
    this.pillChannelRepository = AppDataSource.getRepository(PillChannel)
    this.timeRepository = AppDataSource.getRepository(Time)
    this.medicineRepository = AppDataSource.getRepository(Medicine)
  }

  addPillChannel = async (req: Request, res: Response) => {
    const { channelIndex, userID, medicineID, amount, total, amountPerTime, time } = req.body
    try {
      const pillChannel = new PillChannel()
      pillChannel.channelIndex = channelIndex
      pillChannel.user = userID
      pillChannel.medicine = medicineID
      pillChannel.amount = amount
      pillChannel.total = total
      pillChannel.amountPerTime = amountPerTime
      await this.pillChannelRepository.save(pillChannel)
      const times = time.map((time: any) => {
        const newTime = new Time()
        newTime.time = time
        newTime.pillChannel = pillChannel
        return newTime
      })
      await this.timeRepository.save(times)
      return res.json({ message: 'เพิ่มช่องเก็บยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getPillChannel = async (req: Request, res: Response) => {
    try {
      const userID = req[USER_ID]
      const pillChannels = await this.pillChannelRepository.find({
        where: {
          user: {
            id: userID
          }
        },
        relations: {
          medicine: true
        },
        order: {
          channelIndex: 'ASC'
        }
      })
      return res.json(pillChannels)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  hardwareGetPillChannel = async (req: Request, res: Response) => {
    const { userID } = req.params
    try {
      const pillData = await this.pillChannelRepository
        .createQueryBuilder('pillChannel')
        .leftJoinAndSelect('pillChannel.medicine', 'medicine')
        .leftJoinAndSelect('pillChannel.times', 'time')
        .where('pillChannel.user = :userID', { userID })
        .getMany()
      return res.json(pillData)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  takePill = async (req: Request, res: Response) => {
    const { channelID } = req.params
    try {
      const pillChannel = await this.pillChannelRepository.findOne({
        where: {
          id: channelID
        }
      })
      if (!pillChannel) {
        return res.status(404).json({ message: 'ไม่พบช่องเก็บยา' })
      }
      if (pillChannel.amount === 0) {
        return res.status(400).json({ message: 'ยาหมดแล้ว' })
      }
      pillChannel.amount = pillChannel.amount - pillChannel.amountPerTime
      await this.pillChannelRepository.save(pillChannel)
      return res.json({ message: 'เอายาออกจากช่องเก็บยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getChannelData = async (req: Request, res: Response) => {
    try {
      const channelID = req.params.channelID
      const pillChannel = await this.pillChannelRepository
        .createQueryBuilder('pillChannel')
        .leftJoinAndSelect('pillChannel.medicine', 'medicine')
        .leftJoinAndSelect('pillChannel.times', 'time')
        .where('pillChannel.id = :channelID', { channelID })
        .getOne()
      return res.json(pillChannel)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  getMedicine = async (req: Request, res: Response) => {
    try {
      const medicine = await this.medicineRepository.find({ order: { name: 'ASC' } })
      return res.json(medicine)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  deletePillChannel = async (req: Request, res: Response) => {
    try {
      const channelID = req.params.channelID
      const pillChannel = await this.pillChannelRepository.findOne({
        where: {
          id: channelID
        }
      })
      if (!pillChannel) {
        return res.status(404).json({ message: 'ไม่พบช่องเก็บยา' })
      }
      await this.pillChannelRepository.remove(pillChannel)
      return res.json({ message: 'ลบช่องเก็บยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
