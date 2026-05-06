import dotenv from "dotenv"
import process from "process"
import path from "path"

export const  loadingConfig = () =>{
  const env = process.env.NODE_ENV ?? "local";
  const filePath = path.join(process.cwd() , `.env.${env}`)
  dotenv.config({path : filePath})
}