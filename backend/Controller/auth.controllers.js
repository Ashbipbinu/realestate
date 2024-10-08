import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.handler.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    const isUsernameExist = await User.findOne({ username });
    const isEmailExist = await User.findOne({ email });

    if (isUsernameExist) {
      return res.status(401).json({ error: "Username is already taken!" });
    }

    if (isEmailExist) {
      return res.status(401).json({ error: "Email already exist, try login!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const { password: pass, ...rest } = newUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const emailMatchingProfile = await User.findOne({ email });
    if(!email && !password){
      return next(errorHandler(401, "Please fill all the fields"));
    }
    if (!emailMatchingProfile) {
      return next(errorHandler(401, "Incorrect email"));
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      emailMatchingProfile.password
    );
    if (!isPasswordMatching) {
      return next(errorHandler(401, "Incorrect password"));
    }

    if (emailMatchingProfile && isPasswordMatching) {
      const token = jwt.sign(
        { _id: emailMatchingProfile._id },
        process.env.JWT_SECRET
      );
      const { password: pass, ...rest } = emailMatchingProfile._doc;

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 10 * 24 * 60 * 60,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
     
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ")[0] +
          Math.floor(Math.random() * 10).toString().slice(-4),
        password: hashedPassword,
        email: req.body.email,
        avatar: req.body.photo,
      });
    
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
      newUser.password = null;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUser);
    }
  } catch (error) {
    next(error);
  }
};

export const logOut = async(req, res, next) => {
  try {
    res.clearCookie('access_token')
    res.status(200).json({message: "User logged out successfully"})
  } catch (error) {
    next(error)
  }
}
