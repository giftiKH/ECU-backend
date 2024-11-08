const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup', required: true },
  content: { type: String, required: true },
  readBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
  messageType: { type: String, default: 'text', enum: ['text', 'image', 'file', 'video', 'incidentReport', 'evidenceRequest', 'wantedSuspect', 'exhibit', 'WitnessRequest'] },
  mediaUrl: { type: String },
  incidentReport: { type: mongoose.Schema.Types.ObjectId, ref: 'IncidentReport' },
  exhibit: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibit' },
  evidenceRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'EvidenceRequest' },
  wantedSuspect: { type: mongoose.Schema.Types.ObjectId, ref: 'WantedSuspect' },
  witnessRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'WitnessRequest' },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 
