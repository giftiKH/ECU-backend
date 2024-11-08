const mongoose = require('mongoose');

const witnessRequestSchema = new mongoose.Schema({
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'IncidentReport' },
    caseNumber: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedInChat: { type: Boolean, default: false },
    chatGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup' },
    readBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('WitnessRequest', witnessRequestSchema);
