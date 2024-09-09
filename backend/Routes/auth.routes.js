import express from "express";
import { signUp, login, googleAuth, logOut } from "../Controller/auth.controllers.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", login);
router.get("/signout", logOut)
router.post("/google", googleAuth)

export default router;
