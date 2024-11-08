const mongoose = require('mongoose');

const chatGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false }, // Flag for private chat groups
});

module.exports = mongoose.model('ChatGroup', chatGroupSchema);
