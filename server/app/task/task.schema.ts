import mongoose, { Schema } from "mongoose";

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  projectId: mongoose.Types.ObjectId | string;
  assignedTo: mongoose.Types.ObjectId | string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline?: Date;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    deadline: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("task", taskSchema);
