const mongoose = require('mongoose'); 

const exhibitSchema = new mongoose.Schema({
    exhibitName: { type: String, required: true },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'IncidentReport', required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, required: true, enum: ['image', 'video', 'document'] },
    description: { type: String, required: true },
    evidenceRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'EvidenceRequest' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedInChat: { type: Boolean, default: false },
    chatGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup' },
    readBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
});
 
module.exports = mongoose.model('Exhibit', exhibitSchema);
