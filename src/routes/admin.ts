import { Router } from 'express';
import { addMedicine } from '../controllers/admin/addmedicine';
import { isAdmin } from '../middleware/auth';

const router = Router()

router.get("/", (req, res) => {
    res.send("Hello from admin route")
})

router.post("/addMedicine",isAdmin, addMedicine)

export default router