import { BaseSchemaDto } from "@/common/dto/baseSchema.dto";

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: string;
  assignedTo: string;
  deadline?: Date;
}

export interface UpdateTaskStatusDto {
  status: "TODO" | "IN_PROGRESS" | "DONE";
}
