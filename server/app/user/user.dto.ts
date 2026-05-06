import { BaseSchemaDto } from "@/common/dto/baseSchema.dto";

export interface createUserDto extends BaseSchemaDto{
   name : string,
   password : string,
   email : string,
   role : string,
   refreshToken?: string;
}

export interface IJwtPayload {
  _id: string | undefined;
  role: string;
}

export  interface updateDto extends BaseSchemaDto{
  password?: string;
  name?: string;
  email?: string;
}



