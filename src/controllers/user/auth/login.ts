import { Request, Response } from 'express';
import { AppDataSource } from '../../../data-source';
import { User } from '../../../models/user';
import * as bcrypt from 'bcrypt';
import { cookiesConfig, jwtSecret } from '../../../config/auth';
import * as jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
        return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบถ้วน' });
    }
    try{
        const user = await AppDataSource.getRepository(User).findOne({ where: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user) {
            return res.status(404).json({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
        }
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
        return res.cookie('token', token, cookiesConfig).json({ message: 'เข้าสู่ระบบสำเร็จ' });
    }
    catch(error){
        return res.status(500).json({ message: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง', error: error.message });
    }
}