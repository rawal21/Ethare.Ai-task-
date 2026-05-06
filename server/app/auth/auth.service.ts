import { user } from "@/user/user.schema";
import { registerDto , loginDto } from "./auth.dto";
import bcrypt from "bcrypt"


 export const register = async (payload : registerDto) => {
    const checkUser = await user.findOne({email : payload.email})
    if(checkUser){
        throw new Error("User already exists")
    }
    const hashPassword = await bcrypt.hash(payload.password , 10)
    const newUser = await user.create({
        ...payload,
        password : hashPassword
    })
    
   return newUser.toObject()
}




    