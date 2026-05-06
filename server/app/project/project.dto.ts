import { BaseSchemaDto } from "@/common/dto/baseSchema.dto";
import mongoose from "mongoose";

export interface IProject extends BaseSchemaDto {
  title: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId | string;
  members: mongoose.Types.ObjectId[] | string[];
}

export interface CreateProjectDto {
  title: string;
  description?: string;
  members?: string[];
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  members?: string[];
}
