import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
