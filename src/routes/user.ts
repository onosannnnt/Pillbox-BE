import { Router, Request, Response } from "express";

import { register } from "../controllers/user/register";
import { login } from "../controllers/user/login";

const router = Router()

router.get("/", (req, res) => {
    res.send("Hello from user route")
})

router.post("/register", register)
router.post("/login",login)

export default router