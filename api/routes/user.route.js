import express from "express";
import { test } from "../controllers/user.control.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser,deleteUser } from "../controllers/user.control.js";

const router = express.Router();

router.get('/', test)
router.post("/update/:id",verifyToken,updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)

export default router;