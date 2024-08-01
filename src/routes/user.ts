import { Router } from "express";

import { register } from "../controllers/user/auth/register";
import { login } from "../controllers/user/auth/login";
import { logout } from "../controllers/user/auth/logout";
import { isExist } from "../middleware/auth";
const router = Router()

router.get("/", (req, res) => {
    res.send("Hello from user route")
})

router.post("/register", register)
router.post("/login",login)
router.get("/logout", isExist, logout)

export default router