const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

environmentSchema.index({ projectId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Environment', environmentSchema);
