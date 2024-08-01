import { Request,Response } from "express";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../models/user";
import * as bcrypt from "bcrypt"
import { cookiesConfig, jwtSecret, salt } from "../../../config/auth";
import * as jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    const { email, username, password, lineID, role, numberOfPillChannels} = req.body
    if(!email || !username || !password || !lineID || !role || !numberOfPillChannels){
        return res.status(400).json({message: "กรุณากรอกข้อมูลให้ครบถ้วน"})
    }
    try{
        const user = new User()
        user.email = email
        user.username = username
        user.password = await bcrypt.hash(password, salt)
        user.lineID = lineID
        user.role = role
        user.numberOfPillChannels = numberOfPillChannels
        await AppDataSource.getRepository(User).save(user)
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        }
        const token = jwt.sign(payload, jwtSecret, {algorithm: "HS256",})
        return res.cookie("token", token, cookiesConfig).json({message: "สร้างบัญชีผู้ใช้สำเร็จ"})
    }
    catch(error){
        return res.status(500).json({message: "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง", error: error.message})
    }
}