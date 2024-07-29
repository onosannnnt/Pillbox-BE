import { Request,Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"

export const isExist = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: "กรุณาเข้าสู่ระบบ"})
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        res.locals.payload = payload
        next()
    }
    catch(error){
        return res.status(401).json({message: "กรุณาเข้าสู่ระบบ"})
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: "กรุณาเข้าสู่ระบบ"})
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if(payload.role !== "admin"){
            return res.status(403).json({message: "คุณไม่มีสิทธิ์เข้าถึง"})
        }
        res.locals.payload = payload
        next()
    }
    catch(error){
        return res.status(401).json({message: "กรุณาเข้าสู่ระบบ"})
    }
}