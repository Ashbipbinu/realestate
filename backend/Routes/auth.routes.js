import express from "express";
import { signUp, login } from "../Controller/auth.controllers.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", login)

export default router;
