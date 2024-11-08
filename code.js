const ChatMessage = require('../models/ChatMessage'); // Make sure to require your ChatMessage model
const EvidenceRequest = require('../models/EvidenceRequest'); // Make sure to require your EvidenceRequest model

exports.createEvidenceRequest = async (req, res) => {
    try {
        const { incident, requestingUser, description, sharedInChat, chatGroupId } = req.body;

        // Create a new Evidence Request
        const newEvidenceRequest = new EvidenceRequest({
            incident,
            requestingUser,
            description,
            readBy: [{ userId: requestingUser }] // Add requestingUser to readBy array
        });

        await newEvidenceRequest.save();

        // If sharedInChat is true and chatGroupId is provided, create a chat message
        if (sharedInChat && chatGroupId) {
            const chatMessage = new ChatMessage({
                sender: requestingUser,
                chatGroup: chatGroupId,
                content: `New evidence request created: ${description}`,
                incidentReport: newEvidenceRequest._id, // Reference to the created evidence request
                readBy: [{ userId: requestingUser }] // Optionally add requestingUser to readBy of the chat message
            });

            await chatMessage.save();
        }

        return res.status(201).json({ message: 'Evidence request created successfully.', newEvidenceRequest });
    } catch (error) {
        console.error('Error creating evidence request:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
