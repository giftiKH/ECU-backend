// routes/chatGroupRoutes.js
const express = require('express');
const chatGroupController = require('../controllers/chatGroupController');

const router = express.Router();

router.post('/add', chatGroupController.createChatGroup); 
router.get('/all', chatGroupController.getChatGroups);
router.get('/:id', chatGroupController.getChatGroupById);
router.delete('/:id', chatGroupController.deleteChatGroup);
router.post('/:id/members', chatGroupController.addMemberToChatGroup);
router.delete('/:id/members', chatGroupController.removeMemberFromChatGroup);
router.put('/:id', chatGroupController.updateChatGroup);
router.get('/members/:memberId1/:memberId2', chatGroupController.getChatGroupByMemberIds);
router.get('/chatlist/:currentMemberId', chatGroupController.getChatGroupsByCurrentMemberId);



module.exports = router; 
