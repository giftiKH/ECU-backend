const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
    description: { type: String, required: true },
    reportingOfficer: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    suspects: [{
        name: { type: String, required: true },
        nationality: { type: String, required: true },
        age: { type: Number },
        picture: { type: String },
        arrested: { type: Boolean, default: false },
        arrestDetails: {
            place: { type: String },
            date: { type: Date },
            lawUsed: { type: String },
            agency: { type: String }
        },
        wantedAlert: { type: Boolean, default: false }
    }],
    evidence: [{
        files: [{ type: String, required: true }],
        description: { type: String },
    }],
    status: { type: String, default: 'Open', enum: ['Open', 'In Progress', 'Closed'] },
    sharedInChat: { type: Boolean, default: false },
    chatGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup' },
    readBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
