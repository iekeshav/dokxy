const AuditLog = require('../models/AuditLog');

const logAction = (action) => async (req, res, next) => {
    const userId = req.user._id;
    const details = {
        body: req.body,
        params: req.params,
        query: req.query,
    };

    const auditLog = new AuditLog({
        user: userId,
        action,
        details,
    });

    await auditLog.save();
    next();
};

module.exports = logAction;
