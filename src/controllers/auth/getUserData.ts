import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { User } from "../../models/user";

export const getUserData = async (req: Request, res: Response) => {
    const {emailOrUsername} = req.body
    try{
        const user = await AppDataSource.getRepository(User).findOne({where: [{email: emailOrUsername}, {username: emailOrUsername}]})
        if(!user){
            return res.status(404).json({message: "ไม่พบผู้ใช้"})
        }
        return res.send(user)
    }
    catch(error){
        return res.status(500).json({message: "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง", error: error.message})
    }
}