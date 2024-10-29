import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import { PillChannel } from '../models/pillChannel'
import { USER_ID } from '../config/constance'
import { Time } from '../models/time'
import { Medicine } from '../models/medicine'
import { sendLineMessage } from '../libs/lineMessagine'
import { Between } from 'typeorm'
import { time } from 'console'

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
        newTime.isTaken = false
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
      const pillChannel = await this.pillChannelRepository
        .createQueryBuilder('pillChannel')
        .leftJoinAndSelect('pillChannel.medicine', 'medicine')
        .leftJoinAndSelect('pillChannel.times', 'time')
        .leftJoinAndSelect('pillChannel.user', 'user')
        .where('pillChannel.id = :channelID', { channelID })
        .getOne()
      if (!pillChannel) {
        return res.status(404).json({ message: 'ไม่พบช่องเก็บยา' })
      }
      pillChannel.amount = pillChannel.amount - pillChannel.amountPerTime

      if (pillChannel.amount <= 0) {
        await this.pillChannelRepository.remove(pillChannel)
        // await sendLineMessage(pillChannel.user.lineID, `ยา ${pillChannel.medicine.name} หมดแล้ว กรุณาเติมยา`)
        return res.json({ message: 'ยาหมดแล้ว', pillChannel })
      }
      if (pillChannel.amount <= pillChannel.amountPerTime * pillChannel.times.length * 2) {
        // await sendLineMessage(pillChannel.user.lineID, `ยา ${pillChannel.medicine.name} ใกล้หมดแล้ว กรุณาเติมยา`)
      }
      const times = await this.timeRepository.find({
        where: {
          time: Between(
            new Date(Date.now() - 10 * 60000).toTimeString().slice(0, 5),
            new Date().toTimeString().slice(0, 5)
          ),
          pillChannel: { id: channelID }
        }
      })
      if (times.length === 0) {
        return res.json({ message: 'ยังไม่ถึงเวลาทานยา' })
      }
      times.forEach(async (time) => {
        time.isTaken = true
        await this.timeRepository.save(time)
      })
      await this.pillChannelRepository.save(pillChannel)
      console.log(new Date(Date.now() - 10 * 60000).toTimeString().slice(0, 5), new Date().toTimeString().slice(0, 5))
      return res.json({ message: 'ผู้ใข้งานหยิบยาออกไปแล้ว', times })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error })
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
      const medicine = await this.medicineRepository.find({ order: { name: 'ASC', medicalname: 'ASC' } })
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
  updatePillChannel = async (req: Request, res: Response) => {
    const { channelIndex, amount, total, amountPerTime, time } = req.body
    const channelID = req.params.channelID
    try {
      const pillChannel = await this.pillChannelRepository.findOne({
        where: {
          id: channelID
        }
      })
      if (!pillChannel) {
        return res.status(404).json({ message: 'ไม่พบช่องเก็บยา' })
      }
      pillChannel.channelIndex = channelIndex
      pillChannel.amount = amount
      pillChannel.total = total
      pillChannel.amountPerTime = amountPerTime
      await this.pillChannelRepository.save(pillChannel)
      await this.timeRepository.delete({ pillChannel })
      const times = time.map((time: any) => {
        const newTime = new Time()
        newTime.time = time
        newTime.pillChannel = pillChannel
        newTime.isTaken = false
        return newTime
      })
      await this.timeRepository.save(times)
      return res.json({ message: 'แก้ไขช่องเก็บยาสำเร็จ' })
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
  resetTime = async () => {
    try {
      const times = await this.timeRepository.find()
      times.forEach(async (time) => {
        time.isTaken = false
        await this.timeRepository.save(time)
      })
      return console.log({ message: 'รีเซ็ตเวลาสำเร็จ' })
    } catch (error) {
      return console.log({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}
