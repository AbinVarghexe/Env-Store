const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'secret.create',
        'secret.read',
        'secret.update',
        'secret.delete',
        'secret.reveal',
        'project.create',
        'project.delete',
        'project.member.add',
        'project.member.remove',
        'environment.create',
        'environment.delete',
        'auth.login',
        'auth.login.failed',
        'auth.register',
        'auth.2fa.enable',
        'auth.2fa.disable',
        'token.create',
        'token.revoke',
      ],
    },
    resourceType: {
      type: String,
      enum: ['secret', 'project', 'environment', 'user', 'token'],
      default: null,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1, action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
