import mongoose, { Schema } from "mongoose";
import { IProject } from "./project.dto";

const projectSchema = new Schema<IProject>(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

// Ensure a user can only create a project with a unique title (optional, but good practice. For now, we allow same titles across users if needed, but no index added yet).

export const Project = mongoose.model<IProject>("project", projectSchema);
