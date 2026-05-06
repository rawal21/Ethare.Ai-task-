import mongoose, { Schema } from "mongoose";
import { createUserDto } from "./user.dto";




const userSchema = new Schema<createUserDto>({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        required : true,
        enum : ["admin" , "member"],
        default : "member"
    },
    refreshToken: {
        type: String,
        default: null
    }
},

    { timestamps: true }  
)


export const user = mongoose.model<createUserDto>("user" , userSchema)