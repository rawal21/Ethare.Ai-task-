import { createUserDto } from "./user.dto";
import { user } from "./user.schema";

export const create = async (userData: createUserDto) => {
    return await user.create(userData); 
};

export const getById = async (id: string  | undefined) => {
  return await user.findById(id);
};

export const getByEmail = async (email: string , select?: any) => {
    return await user.findOne({ email }); 
}


export const updateUserById = async (id: string, userData: Partial<createUserDto>) => {
    return await user.findByIdAndUpdate(id, userData, { new: true }); 
}

export const getAll = async () => {
    return await user.find({}, { password: 0 });
}
