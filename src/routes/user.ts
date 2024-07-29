import { Router, Request, Response } from "express";

import { register } from "../controllers/user/register";

const router = Router()

router.get("/", (req, res) => {
    res.send("Hello from user route")
})

router.post("/register", register)

export default router