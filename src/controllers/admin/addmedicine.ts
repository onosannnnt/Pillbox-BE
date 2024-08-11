import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { Medicine } from '../../models/medicine'

export const addMedicine = async (req: Request, res: Response) => {
  const { name, description, note, img } = req.body || ''
  try {
    const medicine = new Medicine()
    medicine.name = name
    medicine.description = description
    medicine.note = note
    medicine.img = img
    await AppDataSource.getRepository(Medicine).save(medicine)
    return res.json({ message: 'เพิ่มข้อมูลยาสำเร็จ' })
  } catch (error) {
    return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message })
  }
}
