const EvidenceRequest = require('../models/EvidenceRequest'); // Adjust the path as necessary

// Create Evidence Request
const ChatMessage = require('../models/ChatMessage'); // Make sure to require your ChatMessage model

// Create Evidence Request
exports.createEvidenceRequest = async (req, res) => {
    try {
        const {
            incident = null,
            requestingUser = null,
            description = '',
            sharedInChat = false,
            chatGroupId = null
        } = req.body;  // Destructure and set default values if not provided

        // Create a new Evidence Request
        const newEvidenceRequest = new EvidenceRequest({
            incident,
            requestingUser,
            description,
            sharedInChat,
            chatGroupId,
            readBy: [{ userId: requestingUser }]  // Add requestingUser to readBy array
        });

        await newEvidenceRequest.save();

        // If sharedInChat is true and chatGroupId is provided, create a chat message
        if (sharedInChat && chatGroupId) {
            const chatMessage = new ChatMessage({ 
                sender: requestingUser,
                chatGroup: chatGroupId,  
                content: `New evidence request created: ${description}`, 
                messageType: 'evidenceRequest',
                evidenceRequest: newEvidenceRequest._id,  // Reference to the created evidence request
                readBy: [{ userId: requestingUser }]  // Optionally add requestingUser to readBy of the chat message
            });

            await chatMessage.save();
        }

        return res.status(201).json({ message: 'Evidence request created successfully.', newEvidenceRequest });
    } catch (error) {
        console.error('Error creating evidence request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get Evidence Request By ID
exports.getEvidenceRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const evidenceRequest = await EvidenceRequest.findById(id)
            .populate('incident')
            .populate('requestingUser')
          .populate('chatGroupId')
            .populate('readBy.userId');

        if (!evidenceRequest) {
            return res.status(404).json({ message: 'Evidence request not found.' });
        }

        return res.status(200).json(evidenceRequest);
    } catch (error) {
        console.error('Error retrieving evidence request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


// Update Evidence Request
exports.updateEvidenceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const {  incident,
            requestingUser,
            description } = req.body;

        const updatedEvidenceRequest = await EvidenceRequest.findByIdAndUpdate(
            id,
            {  incident,
                requestingUser,
                description, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedEvidenceRequest) {
            return res.status(404).json({ message: 'Evidence request not found.' });
        }

        return res.status(200).json({ message: 'Evidence request updated successfully.', updatedEvidenceRequest });
    } catch (error) {
        console.error('Error updating evidence request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Delete Evidence Request
exports.deleteEvidenceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEvidenceRequest = await EvidenceRequest.findByIdAndDelete(id);

        if (!deletedEvidenceRequest) {
            return res.status(404).json({ message: 'Evidence request not found.' });
        }

        return res.status(200).json({ message: 'Evidence request deleted successfully.' });
    } catch (error) {
        console.error('Error deleting evidence request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get Evidence Requests By Incident
exports.getEvidenceRequestsByIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const evidenceRequests = await EvidenceRequest.find({ incident: incidentId })
            .populate('incident')
            .populate('requestingUser')
            .populate('chatGroupId')
            .populate('readBy.userId');

        return res.status(200).json(evidenceRequests);
    } catch (error) {
        console.error('Error retrieving evidence requests by incident:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get All Evidence Requests
exports.getAllEvidenceRequests = async (req, res) => {
    try {
        const { incidentId, requestingUserId } = req.query;
        const filter = {};

        if (incidentId) filter.incident = incidentId;
        if (requestingUserId) filter.requestingUser = requestingUserId;

        const evidenceRequests = await EvidenceRequest.find(filter)
            .populate('incident')
            .populate('requestingUser')
            .populate('chatGroupId')
            .populate('readBy.userId');

        return res.status(200).json(evidenceRequests);
    } catch (error) {
        console.error('Error retrieving all evidence requests:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


exports.markEvidenceRequestAsShared = async (req, res) => {
    try {
        const { id } = req.params;
        const { chatGroupId } = req.body;

        // Update the evidence request to mark it as shared
        const updatedEvidenceRequest = await EvidenceRequest.findByIdAndUpdate(
            id,
            { sharedInChat: true, chatGroupId },
            { new: true }
        );

        if (!updatedEvidenceRequest) {
            return res.status(404).json({ message: 'Evidence request not found.' });
        }

        // Create a chat message after marking the evidence request as shared
        const chatMessage = new ChatMessage({
            sender: updatedEvidenceRequest.requestingUser, // Assuming requestingUser is the sender
            chatGroup: chatGroupId,
            content: `Evidence request shared: ${updatedEvidenceRequest.description}`,
            evidenceRequest: updatedEvidenceRequest._id, // Reference to the incident
            readBy: [{ userId: updatedEvidenceRequest.requestingUser }], // Mark it as read by the user who created the request
            messageType: 'evidenceRequest', // You can change this if needed
        });

        await chatMessage.save(); // Save the chat message to the database

        return res.status(200).json({
            message: 'Evidence request marked as shared and message created in chat.',
            updatedEvidenceRequest
        });
    } catch (error) {
        console.error('Error marking evidence request as shared:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


// Get Evidence Requests By User
exports.getEvidenceRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const evidenceRequests = await EvidenceRequest.find({ requestingUser: userId })
            .populate('incident')
            .populate('requestingUser')
            .populate('chatGroupId')
            .populate('readBy.userId');

        return res.status(200).json(evidenceRequests);
    } catch (error) {
        console.error('Error retrieving evidence requests by user:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};



// Get Evidence Requests Shared In Chat
exports.getEvidenceRequestsSharedInChat = async (req, res) => {
    try {
        const evidenceRequests = await EvidenceRequest.find({ sharedInChat: true })
            .populate('incident')
            .populate('requestingUser')
            .populate('chatGroupId')
            .populate('readBy.userId');
        return res.status(200).json(evidenceRequests);
    } catch (error) {
        console.error('Error retrieving evidence requests shared in chat:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Mark Request As Read
exports.markRequestAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const evidenceRequest = await EvidenceRequest.findById(id);

        if (!evidenceRequest) {
            return res.status(404).json({ message: 'Evidence request not found.' });
        }

        // Check if user has already read the request
        if (!evidenceRequest.readBy.some(entry => entry.userId.toString() === userId)) {
            evidenceRequest.readBy.push({ userId, readAt: Date.now() });
            await evidenceRequest.save();
        }

        return res.status(200).json({ message: 'Request marked as read.', evidenceRequest });
    } catch (error) {
        console.error('Error marking request as read:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Count Unread Request
exports.countUnreadRequest = async (req, res) => {
    try {
        const { userId } = req.params;

        const count = await EvidenceRequest.countDocuments({
            'readBy.userId': { $ne: userId }
        });

        return res.status(200).json({ unreadCount: count });
    } catch (error) {
        console.error('Error counting unread requests:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
