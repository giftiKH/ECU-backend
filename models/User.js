const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    phoneVerified: { type: Boolean, default: false },
    role: { type: String, required: true, enum: ['admin', 'member'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    organization: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastSeen: { type: Date, default: Date.now },
    profilePicture: { type: String, default: 'path/to/placeholder/image.png' }
});


module.exports = mongoose.model('User', userSchema);
