import { Request, Response} from "express";

export const logout = async (req: Request, res: Response) => {
    try{
        return res.clearCookie("token").json({message: "ออกจากระบบสำเร็จ"})
    }
    catch(error){
        return res.status(500).json({message: "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง", error: error.message})
    }
}