import mongoose from "mongoose";

const environmentSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

environmentSchema.index({ projectId: 1, name: 1 }, { unique: true });

export default mongoose.models.Environment || mongoose.model("Environment", environmentSchema);
