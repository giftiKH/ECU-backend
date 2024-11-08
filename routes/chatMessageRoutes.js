// routes/chatMessageRoutes.js

const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatMessageController');

// 1. Send a new message
router.post('/send', chatMessageController.sendMessage);

// 2. Get all messages in a chat group
router.get('/group/:chatGroup', chatMessageController.getChatMessages);

// 3. Get a specific message by its ID
router.get('/:messageId', chatMessageController.getMessageById);

// 4. Update a message by its ID
router.put('/:messageId', chatMessageController.updateMessage);

// 5. Delete a message by its ID
router.delete('/:messageId', chatMessageController.deleteMessage);

// 6. Mark a message as read
router.post('/:messageId/read', chatMessageController.markMessageAsRead);

// 7. Reply to a message
router.post('/:messageId/reply', chatMessageController.replyToMessage);

// 8. Count unread messages in a chat group for a user
router.get('/group/:chatGroupId/unread/:userId', chatMessageController.countUnreadMessages);

// 9. Get the last message sent in a chat group
router.get('/group/:chatGroupId/last-message', chatMessageController.getLastMessage);

module.exports = router;
