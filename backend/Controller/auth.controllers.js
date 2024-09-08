import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from '../utils/error.handler.js';
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
  console.log("hit")
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    const isUsernameExist = await User.findOne({username});
    const isEmailExist = await User.findOne({email});

    if(isUsernameExist){
      return res.status(401).json({error: "Username is already taken!"})
    }

    if(isEmailExist){
      return res.status(401).json({error: "Email already exist, try login!"})

    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const { password:pass, ...rest} = newUser._doc
    res.status(201).json(rest);
    
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) =>{
  const { email, password } = req.body;
  try {
    const emailMatchingProfile = await User.findOne({email});
    const isPasswordMatching = await bcrypt.compare(password, emailMatchingProfile.password)
    if(!emailMatchingProfile){
      return next(errorHandler(401, "Incorrect email"))
    }

    if(!isPasswordMatching){
      return next(errorHandler(401, "Incorrect password"))
    }

    if(emailMatchingProfile && isPasswordMatching){
      const { password:pass, ...rest} = emailMatchingProfile._doc
      const token = jwt.sign({ _id: emailMatchingProfile._id}, process.env.JWT_SECRET);
      return res.cookie("access_token", token, {httpOnly: true, maxAge: 10 * 24 * 60 * 60}).status(200).json(rest)
    }
  } catch (error) {
    next(error)
  }
}
