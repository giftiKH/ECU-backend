const mongoose = require('mongoose');

const wantedSuspectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nationality: { type: String, required: true },
    image: { type: String },
    lastKnownLocation: { type: String }, 
    age: { type: Number },
    agencyReported: { type: String },
    incidentAssociated: { type: mongoose.Schema.Types.ObjectId, ref: 'IncidentReport' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedInChat: { type: Boolean, default: false },
    chatGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup' },
    readBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WantedSuspect', wantedSuspectSchema);
