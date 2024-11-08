const Exhibit = require('../models/Exhibit'); // Adjust path as necessary
const ChatMessage = require('../models/ChatMessage'); // Make sure to require your ChatMessage model


// Create a new exhibit
exports.createExhibit = async (req, res) => {
    try {
        const { 
            exhibitName = '', 
            mediaUrl = '', 
            mediaType = '', 
            evidenceRequest = null,  
            createdBy = null,
            incident = null,
            description = '',
            sharedInChat = false,
            chatGroupId = null
         } = req.body;

        const newExhibit = new Exhibit({
            exhibitName,
            incident,
            mediaUrl,
            mediaType,
            description,
            evidenceRequest, 
            createdBy,
            sharedInChat,
            chatGroupId,
            readBy: [{ userId: createdBy }]
        });

        await newExhibit.save();

         // If sharedInChat is true and chatGroupId is provided, create a chat message
        if (sharedInChat && chatGroupId) {
            const chatMessage = new ChatMessage({
                sender: createdBy,
                chatGroup: chatGroupId,
                content: description,
                exhibit: newExhibit._id,  // Reference to the created evidence request
                messageType: 'exhibit',
                readBy: [{ userId: createdBy }]  // Optionally add requestingUser to readBy of the chat message
            });

            await chatMessage.save();
        }

        return res.status(201).json({ message: 'Exhibit created successfully.', exhibit: newExhibit });
    } catch (error) {
        console.error('Error creating exhibit:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get exhibit by ID
exports.getExhibitById = async (req, res) => {
    try {
        const { id } = req.params;
        const exhibit = await Exhibit.findById(id)
        .populate('incident')
        .populate('createdBy')
        .populate('evidenceRequest')
        .populate('chatGroupId')
        .populate('readBy.userId');

        if (!exhibit) {
            return res.status(404).json({ message: 'Exhibit not found.' });
        }

        return res.status(200).json(exhibit);
    } catch (error) {
        console.error('Error retrieving exhibit:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Update an exhibit
exports.updateExhibit = async (req, res) => {
    try {
        const { id } = req.params;
        const { mediaUrl, mediaType, description } = req.body;

        const updatedExhibit = await Exhibit.findByIdAndUpdate(
            id,
            { mediaUrl, mediaType, description, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedExhibit) {
            return res.status(404).json({ message: 'Exhibit not found.' });
        }

        return res.status(200).json({ message: 'Exhibit updated successfully.', exhibit: updatedExhibit });
    } catch (error) {
        console.error('Error updating exhibit:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Delete exhibit by ID
exports.deleteExhibit = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedExhibit = await Exhibit.findByIdAndDelete(id);

        if (!deletedExhibit) {
            return res.status(404).json({ message: 'Exhibit not found.' });
        }

        return res.status(200).json({ message: 'Exhibit deleted successfully.' });
    } catch (error) {
        console.error('Error deleting exhibit:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get exhibits by incident
exports.getExhibitsByIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;

        const exhibits = await Exhibit.find({ incident: incidentId })
        .populate('incident')
        .populate('createdBy')
        .populate('evidenceRequest')
        .populate('chatGroupId')
        .populate('readBy.userId');

        return res.status(200).json(exhibits);
    } catch (error) {
        console.error('Error retrieving exhibits:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get all exhibits with optional filters
exports.getAllExhibits = async (req, res) => {
    try {
        const { mediaType, incidentId } = req.query;
        const filters = {};

        if (mediaType) filters.mediaType = mediaType;
        if (incidentId) filters.incident = incidentId;

        const exhibits = await Exhibit.find(filters)
        .populate('incident')
        .populate('createdBy')
        .populate('evidenceRequest')
        .populate('chatGroupId')
        .populate('readBy.userId');

        return res.status(200).json(exhibits);
    } catch (error) {
        console.error('Error retrieving exhibits:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Mark exhibit as shared
exports.markExhibitAsShared = async (req, res) => {
    try {
        const { id } = req.params;
        const { chatGroupId } = req.body;

        const updatedExhibit = await Exhibit.findByIdAndUpdate(
            id,
            { sharedInChat: true, chatGroupId, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedExhibit) {
            return res.status(404).json({ message: 'Exhibit not found.' });
        }

        const chatMessage = new ChatMessage({
            sender: updatedExhibit.createdBy,
            chatGroup: chatGroupId,
            content: updatedExhibit.description,
            exhibit: updatedExhibit._id,  // Reference to the created evidence request
           
            messageType: 'exhibit',
            readBy: [{ userId: updatedExhibit.createdBy }]  // Optionally add requestingUser to readBy of the chat message
        });

        await chatMessage.save();


        return res.status(200).json({ message: 'Exhibit marked as shared and message created in chat.', exhibit: updatedExhibit });
    } catch (error) {
        console.error('Error marking exhibit as shared:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get exhibits by user
exports.getExhibitsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const exhibits = await Exhibit.find({ createdBy: userId })
        .populate('incident')
        .populate('createdBy')
        .populate('evidenceRequest')
        .populate('chatGroupId')
        .populate('readBy.userId');

        return res.status(200).json(exhibits);
    } catch (error) {
        console.error('Error retrieving exhibits:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};



// Get exhibits with evidence request
exports.getExhibitsWithEvidenceRequest = async (req, res) => {
    try {
        const { evidenceRequestId } = req.params;

        const exhibits = await Exhibit.find({ evidenceRequest: evidenceRequestId })
        .populate('incident')
        .populate('createdBy')
        .populate('evidenceRequest')
        .populate('chatGroupId')
        .populate('readBy.userId');

        return res.status(200).json(exhibits);
    } catch (error) {
        console.error('Error retrieving exhibits with evidence request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Mark request as read
exports.markRequestAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const updatedExhibit = await Exhibit.findByIdAndUpdate(
            id,
            { $addToSet: { readBy: { userId, readAt: new Date() } } },
            { new: true }
        );

        if (!updatedExhibit) {
            return res.status(404).json({ message: 'Exhibit not found.' });
        }

        return res.status(200).json({ message: 'Exhibit marked as read.', exhibit: updatedExhibit });
    } catch (error) {
        console.error('Error marking exhibit as read:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Count unread requests
exports.countUnreadRequest = async (req, res) => {
    try {
        const { userId } = req.params;

        const unreadCount = await Exhibit.countDocuments({
            'readBy.userId': { $ne: userId }
        });

        return res.status(200).json({ unreadCount });
    } catch (error) {
        console.error('Error counting unread requests:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
