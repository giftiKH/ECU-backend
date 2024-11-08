// controllers/chatMessageController.js

const ChatMessage = require('../models/ChatMessage'); 
const ChatGroup = require('../models/ChatGroup');

// 1. SendMessage
exports.sendMessage = async (req, res) => {  
  try {
      const { sender, chatGroup, content, messageType, mediaUrl, incidentReport, replyTo } = req.body;

      const newMessage = new ChatMessage({
          sender,
          chatGroup,
          content, 
          messageType,
          mediaUrl,
          incidentReport,
          replyTo,
          readBy: [{ userId: sender }] // Add sender ID to readBy array
      });

      await newMessage.save(); 

      return res.status(201).json({ message: 'Message sent successfully.', newMessage });
  } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ message: 'Server error.' });
  }
};


// 2. GetChatMessages
exports.getChatMessages = async (req, res) => {
    try {
        const { chatGroup } = req.params;
        const { page = 1, limit = 20, messageType } = req.query;

        const query = { chatGroup };
        if (messageType) {
            query.messageType = messageType;
        }

        const messages = await ChatMessage.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('sender', 'profilePicture name')
            .populate({
                path: 'witnessRequest',
                populate: {
                    path: 'incident',
                    select: 'description', // Change to include more fields if needed
                },
                populate: {
                    path: 'requestedUser',
                    select: 'name', // Change to include more fields if needed
                },
                populate: {
                    path: 'requestingUser',
                    select: 'name', // Change to include more fields if needed
                },
            })
            .populate('incidentReport')
            .populate('exhibit')
            .populate('evidenceRequest')
            .populate('wantedSuspect');

        return res.status(200).json({ messages });
    } catch (error) {
        console.error('Error retrieving chat messages:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 3. GetMessageById
exports.getMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await ChatMessage.findById(messageId).populate('sender');

        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        return res.status(200).json({ message });
    } catch (error) {
        console.error('Error fetching message by ID:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 4. UpdateMessage
exports.updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content, userId } = req.body;

        const message = await ChatMessage.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        message.content = content;
        message.editedAt = new Date();
        message.editedBy = userId;

        await message.save();

        return res.status(200).json({ message: 'Message updated successfully.', message });
    } catch (error) {
        console.error('Error updating message:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 5. DeleteMessage
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        await ChatMessage.findByIdAndDelete(messageId);

        return res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 6. MarkMessageAsRead
exports.markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId } = req.body;

        const message = await ChatMessage.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        message.readBy.push({ userId, readAt: new Date() });
        await message.save();

        return res.status(200).json({ message: 'Message marked as read.', message });
    } catch (error) {
        console.error('Error marking message as read:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 7. ReplyToMessage
exports.replyToMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { sender, content } = req.body;

        const message = await ChatMessage.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Original message not found.' });
        }

        const replyMessage = new ChatMessage({
            sender,
            chatGroup: message.chatGroup,
            content,
            replyTo: messageId,
        });

        await replyMessage.save();

        return res.status(201).json({ message: 'Reply sent successfully.', replyMessage });
    } catch (error) {
        console.error('Error sending reply:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 8. CountUnreadMessages
exports.countUnreadMessages = async (req, res) => {
    try {
        const { chatGroupId, userId } = req.params;

        const unreadCount = await ChatMessage.countDocuments({
            chatGroup: chatGroupId,
            'readBy.userId': { $ne: userId },
        });

        return res.status(200).json({ unreadCount });
    } catch (error) {
        console.error('Error counting unread messages:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// 9. GetLastMessage
exports.getLastMessage = async (req, res) => {
    try {
        const { chatGroupId } = req.params;

        const lastMessage = await ChatMessage.findOne({ chatGroup: chatGroupId })
            .sort({ createdAt: -1 });

        if (!lastMessage) {
            return res.status(404).json({ message: 'No messages found in this chat group.' });
        }

        return res.status(200).json({ lastMessage });
    } catch (error) {
        console.error('Error fetching last message:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
