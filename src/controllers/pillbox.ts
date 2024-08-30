import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import { PillChannel } from '../models/pillChannel'
import { USER_ID } from '../config/constance'
import { Time } from '../models/time'

export class Pillbox {
  private pillChannelRepository = AppDataSource.getRepository(PillChannel)
  private timeRepository = AppDataSource.getRepository(Time)
  constructor() {
    this.pillChannelRepository = AppDataSource.getRepository(PillChannel)
    this.timeRepository = AppDataSource.getRepository(Time)
  }

  addPillChannel = async (req: Request, res: Response) => {
    const { channelIndex, userID, medicineID, amount, total, amountPerTime, time } = req.body
    try {
      const pillChannel = new PillChannel()
      pillChannel.channelIndex = channelIndex
      pillChannel.user = userID
      pillChannel.medicine = medicineID
      pillChannel.amount = amount
      pillChannel.Total = total
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
      const pillChannels = await this.pillChannelRepository.find({
        where: {
          user: {
            id: userID
          }
        },
        relations: {
          medicine: true
        }
      })
      return res.json(pillChannels)
    } catch (error) {
      return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
    }
  }
}