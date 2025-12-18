const AuditLog = require('../models/AuditLog');

const logAudit = async ({ action, actor, target, details, req }) => {
  try {
    const auditEntry = new AuditLog({
      action,
      actor: {
        userId: actor.userId,
        email: actor.email
      },
      target: target ? {
        userId: target.userId,
        email: target.email
      } : undefined,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers['user-agent']
    });

    await auditEntry.save();
    return auditEntry;
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't throw error to avoid breaking main functionality
  }
};

module.exports = { logAudit };