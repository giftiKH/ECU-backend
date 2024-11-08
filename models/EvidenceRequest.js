const mongoose = require('mongoose');

const evidenceRequestSchema = new mongoose.Schema({
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'IncidentReport', required: true },
    requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    sharedInChat: { type: Boolean, default: false },
    chatGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup' },
    readBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model('EvidenceRequest', evidenceRequestSchema);
