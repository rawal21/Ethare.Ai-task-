import { BaseSchemaDto } from "@/common/dto/baseSchema.dto";

export interface loginDto {
    email : string,
    password : string
}

export interface registerDto extends loginDto {
    name : string,
    role : string
}

export interface cookieResponseDto {
    refreshToken : string,
    accessToken : string
}


export interface AuthResponseDto extends BaseSchemaDto {
   loginDto : loginDto,
   registerDto : registerDto,
   cookieResponseDto : cookieResponseDto
}