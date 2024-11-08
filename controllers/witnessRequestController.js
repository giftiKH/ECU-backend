const WitnessRequest = require('../models/WitnessRequest');
const ChatMessage = require('../models/ChatMessage'); // Make sure to require your ChatMessage model


// Create a new witness request
exports.createWitnessRequest = async (req, res) => {
  try {
    const {
      incident = null,
      caseNumber = '', 
      date = null,
      time = '',
      location = '',
      requestingUser = null,
      requestedUser = null,
      sharedInChat = false,
      chatGroupId = null,
    } = req.body;

    const witnessRequest = new WitnessRequest({
      incident,
      caseNumber,
      date,
      time,
      location,
      requestingUser,
      requestedUser,
      sharedInChat,
      chatGroupId,
      readBy: [{ userId: requestingUser }]
    });

    await witnessRequest.save();

    // If sharedInChat is true and chatGroupId is provided, create a chat message
    if (sharedInChat && chatGroupId) {
      const chatMessage = new ChatMessage({
        sender: requestingUser,
        chatGroup: chatGroupId,
        content: 'You are required to appear as a witness in court:',
        witnessRequest: witnessRequest._id,  // Reference to the created evidence request
        messageType: 'WitnessRequest',
        readBy: [{ userId: requestingUser }]  // Optionally add requestingUser to readBy of the chat message
      });

      await chatMessage.save();
    }

    res.status(201).json(witnessRequest);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating witness request', error: error.message });
      }
};

// Get witness request by ID
exports.getWitnessRequestById = async (req, res) => {
  try {
    const witnessRequest = await WitnessRequest.findById(req.params.id)
      .populate('incident')
      .populate('requestingUser')
      .populate('requestedUser')
      .populate('chatGroupId')
      .populate('readBy.userId');

    if (!witnessRequest) return res.status(404).json({ message: 'Witness request not found' });
    res.status(200).json(witnessRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching witness request', error });
  }
};

// Update witness request by ID
exports.updateWitnessRequest = async (req, res) => {
  try {
    const updatedRequest = await WitnessRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) return res.status(404).json({ message: 'Witness request not found' });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating witness request', error });
  }
};

// Delete witness request by ID
exports.deleteWitnessRequest = async (req, res) => {
  try {
    const deletedRequest = await WitnessRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ message: 'Witness request not found' });
    res.status(200).json({ message: 'Witness request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting witness request', error });
  }
};

// Get witness requests by incident ID
exports.getWitnessRequestsByIncident = async (req, res) => {
  try {
    const witnessRequests = await WitnessRequest.find({ incident: req.params.incidentId })
    .populate('incident')
    .populate('requestingUser')
    .populate('requestedUser')
    .populate('chatGroupId')
    .populate('readBy.userId');

    res.status(200).json(witnessRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching witness requests', error });
  }
};

// Get all witness requests with optional filters
exports.getAllWitnessRequests = async (req, res) => {
  try {
   
    const witnessRequests = await WitnessRequest.find();

    res.status(200).json(witnessRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching witness requests', error });
  }
};


// Mark witness request as shared in chat group
exports.markWitnessRequestAsShared = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatGroupId } = req.body;

    const updatedRequest = await WitnessRequest.findByIdAndUpdate(
      id,
      { sharedInChat: true, chatGroupId },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Witness request not found.' });
    }

    const chatMessage = new ChatMessage({
      sender: updatedRequest.requestingUser,
      chatGroup: chatGroupId,
      content: 'You are required to appear as a witness in court:',
      witnessRequest: updatedRequest._id,  // Reference to the created evidence request
      messageType: 'WitnessRequest',
      readBy: [{ userId: updatedRequest.requestingUser }]  // Optionally add requestingUser to readBy of the chat message
    });

    await chatMessage.save();

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing witness request', error });
  }
};

// Get witness requests by requesting user
exports.getWitnessRequestsByUser = async (req, res) => {
  try {
    const witnessRequests = await WitnessRequest.find({ requestingUser: req.params.userId })
    .populate('incident')
    .populate('requestingUser')
    .populate('requestedUser')
    .populate('chatGroupId')
    .populate('readBy.userId');

    res.status(200).json(witnessRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching witness requests', error });
  }
};

// Get upcoming witness requests
exports.getUpcomingWitnessRequests = async (req, res) => {
  try {
    const currentDate = new Date();
    const witnessRequests = await WitnessRequest.find({ date: { $gte: currentDate } })
    .populate('incident')
    .populate('requestingUser')
    .populate('requestedUser')
    .populate('chatGroupId')
    .populate('readBy.userId');
    
    res.status(200).json(witnessRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming witness requests', error });
  }
};

// Mark request as read by a user
exports.markRequestAsRead = async (req, res) => {
  try {
    const witnessRequest = await WitnessRequest.findById(req.params.id);
    if (!witnessRequest) return res.status(404).json({ message: 'Witness request not found' });

    const readBy = witnessRequest.readBy || [];
    if (!readBy.some((r) => r.userId.equals(req.body.userId))) {
      witnessRequest.readBy.push({ userId: req.body.userId });
      await witnessRequest.save();
    }

    res.status(200).json(witnessRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error marking request as read', error });
  }
};

// Count unread witness requests for a user
exports.countUnreadRequest = async (req, res) => {
  try {
    const witnessRequests = await WitnessRequest.find({ "readBy.userId": { $ne: req.params.userId } });
    const unreadCount = witnessRequests.length;
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting unread requests', error });
  }
};
