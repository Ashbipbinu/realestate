import express from "express";
import { signUp, login, googleAuth } from "../Controller/auth.controllers.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", login);
router.post("/google", googleAuth)

export default router;
