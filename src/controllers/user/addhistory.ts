import { Request, Response} from "express";
import { AppDataSource } from "../../data-source";
import { LogHistory } from "../../models/loghistory";

export const addHistory = async (req: Request, res: Response) => {
    const {task, userID, medicineID} = req.body
    try{
        const log = new LogHistory()
        log.task = task
        log.createdAt = new Date()
        log.user = userID
        log.medicine = medicineID
        await AppDataSource.getRepository(LogHistory).save(log)
    return res.json({message: "เพิ่มประวัติการใช้ยาสำเร็จ"})
    }
    catch(error){
        return res.status(500).json({message: "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง", error: error.message})
    }
}