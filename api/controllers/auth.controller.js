import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import errorHandler from "../utils/error.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'SHIVAM';

export const signup = async (req,res,next)=>
{
    const {username,email,password} = req.body;
    const hashpassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashpassword});
    try{
        await newUser.save();
        res.status(201).json({message:"New User Created"});
    }
    catch(error){
        next(error);
    }
};

export const signin = async(req,res,next)=>
{
    const {email,password} = req.body;

    try 
    {
        const validuser = await User.findOne({email})
        if(!validuser)
        {
            return next(errorHandler(404,'User not Found'));
        }
        const validpassword = bcryptjs.compareSync(password,validuser.password);
        if(!validpassword)
        {
            return next(errorHandler(401,'Invalid Credentials'))
        }
        const token = jwt.sign({id:validuser._id},JWT_SECRET);
        const {password:hashpassword,...rest} = validuser._doc;
        const expiryDate = new Date(Date.now()+3600000);
        res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
    } 
    catch (error) {
        next(error);
    }
}
export const google = async (req, res, next) => 
{
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id },JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hashedPassword,
          profilePicture: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id },JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };


export const signout = async(req,res) =>
{
  res.clearCookie('access_token').status(200).json({message:'Signout success'})
}