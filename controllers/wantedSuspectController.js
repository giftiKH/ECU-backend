const WantedSuspect = require('../models/WantedSuspect');
const ChatMessage = require('../models/ChatMessage'); // Make sure to require your ChatMessage model


// Create a new wanted suspect
exports.createWantedSuspect = async (req, res) => {
    try { 
        const { 
            name = '',
            nationality = '',
            image = '',
            lastKnownLocation = '',
            age = '',
            agencyReported = '',
            incidentAssociated = null,
            sharedInChat = false,
            chatGroupId = null,
            createdBy = null,
        } = req.body;

        const newSuspect = new WantedSuspect({
            name ,
            nationality,
            image,
            lastKnownLocation,
            age,
            agencyReported,
            incidentAssociated,
            sharedInChat,
            chatGroupId,
            createdBy,
            readBy: [{ userId: createdBy }]
        });
       
        await newSuspect.save();

         // If sharedInChat is true and chatGroupId is provided, create a chat message
         if (sharedInChat && chatGroupId) {
            const chatMessage = new ChatMessage({
                sender: createdBy,
                chatGroup: chatGroupId,
                content: 'Wanted Suspect',
                WantedSuspect: newSuspect._id,  // Reference to the created evidence request
                messageType: 'WantedSuspect',
                readBy: [{ userId: createdBy }]  // Optionally add requestingUser to readBy of the chat message
            });

            await chatMessage.save();
        }

        res.status(201).json(newSuspect);
    } catch (error) {
        console.error('Error creating wanted suspect:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get wanted suspect by ID
exports.getWantedSuspectById = async (req, res) => {
    try {
        const suspect = await WantedSuspect.findById(req.params.id)
        .populate('incidentAssociated')
        .populate('createdBy')
        .populate('chatGroupId')
        .populate('readBy.userId');

        if (!suspect) {
            return res.status(404).json({ message: 'Wanted suspect not found.' });
        }
        res.status(200).json(suspect);
    } catch (error) {
        console.error('Error retrieving wanted suspect by ID:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update wanted suspect by ID
exports.updateWantedSuspect = async (req, res) => {
    try {
        const updatedSuspect = await WantedSuspect.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSuspect) {
            return res.status(404).json({ message: 'Wanted suspect not found.' });
        }
        res.status(200).json(updatedSuspect);
    } catch (error) {
        console.error('Error updating wanted suspect:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Delete wanted suspect by ID
exports.deleteWantedSuspect = async (req, res) => {
    try {
        const deletedSuspect = await WantedSuspect.findByIdAndDelete(req.params.id);
        if (!deletedSuspect) {
            return res.status(404).json({ message: 'Wanted suspect not found.' });
        }
        res.status(200).json({ message: 'Wanted suspect deleted successfully.' });
    } catch (error) {
        console.error('Error deleting wanted suspect:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all wanted suspects
exports.getAllWantedSuspects = async (req, res) => {
    try {
        const suspects = await WantedSuspect.find()
        .populate('incidentAssociated')
        .populate('createdBy')
        .populate('chatGroupId')
        .populate('readBy.userId');

        res.status(200).json(suspects);
    } catch (error) {
        console.error('Error retrieving all wanted suspects:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Mark wanted suspect as shared
exports.markWantedSuspectAsShared = async (req, res) => {
    try {
        const { id } = req.params;
        const { chatGroupId } = req.body;

        const updatedSuspect = await WantedSuspect.findByIdAndUpdate(
            id,
            { sharedInChat: true, chatGroupId },
            { new: true }
        );

        if (!updatedSuspect) {
            return res.status(404).json({ message: 'Wanted suspect not found.' });
        }

        const chatMessage = new ChatMessage({
            sender: updatedSuspect.createdBy,
            chatGroup: chatGroupId,
            content: 'Wanted Suspect',
            WantedSuspect: updatedSuspect._id,  // Reference to the created evidence request
            messageType: 'WantedSuspect',
            readBy: [{ userId: updatedSuspect.createdBy }]  // Optionally add requestingUser to readBy of the chat message
        });

        await chatMessage.save();

        return res.status(200).json({ message: 'Wanted suspect marked as shared.', updatedSuspect });
    } catch (error) {
        console.error('Error marking wanted suspect as shared:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Get wanted suspects by incident
exports.getWantedSuspectsByIncident = async (req, res) => {
    try {
        const suspects = await WantedSuspect.find({ incidentAssociated: req.params.incidentId })
        .populate('incidentAssociated')
        .populate('createdBy')
        .populate('chatGroupId')
        .populate('readBy.userId');
        if (!suspects) {
            return res.status(404).json({ message: 'No wanted suspects found for this incident.' });
        }
        res.status(200).json(suspects);
    } catch (error) {
        console.error('Error retrieving wanted suspects by incident:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Mark report as read by user
exports.markReportAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const updatedSuspect = await WantedSuspect.findByIdAndUpdate(
            id,
            { $addToSet: { readBy: { userId, readAt: new Date() } } },
            { new: true }
        );

        if (!updatedSuspect) {
            return res.status(404).json({ message: 'Wanted suspect not found.' });
        }

        return res.status(200).json({ message: 'Report marked as read.', updatedSuspect });
    } catch (error) {
        console.error('Error marking report as read:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Count unread reports for a user
exports.countUnreadReport = async (req, res) => {
    try {
        const { userId } = req.params;
        const unreadCount = await WantedSuspect.countDocuments({
            'readBy.userId': { $ne: userId }
        });

        return res.status(200).json({ unreadCount });
    } catch (error) {
        console.error('Error counting unread reports:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
