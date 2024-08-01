import { Router } from "express";

import { register } from "../controllers/auth/register";
import { login } from "../controllers/auth/login";
import { logout } from "../controllers/auth/logout";
import { isExist } from "../middleware/auth";
import { addHistory } from "../controllers/user/addhistory";
import { getUserLineID } from "../controllers/auth/getuserlineid";
const router = Router()

router.get("/", (req, res) => {
    res.send("Hello from user route")
})

router.post("/register", register)
router.post("/login",login)
router.get("/logout", isExist, logout)
router.get("/getUserLineID", getUserLineID)

router.post("/addHistory", isExist, addHistory)

export default router