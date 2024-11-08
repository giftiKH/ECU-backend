// controllers/chatGroupController.js
const ChatGroup = require('../models/ChatGroup');
const ChatMessage = require('../models/ChatMessage'); 

exports.createChatGroup = async (req, res) => { 
    try {
        const { members, isPrivate } = req.body; 

        if (!members || !Array.isArray(members) || members.length < 1) {
            return res.status(400).json({ message: 'At least one member is required.' });
        }    

        let groupName;  

        if (isPrivate) { 
            if (members.length !== 2) {
                return res.status(400).json({ message: 'Private chat groups require exactly two members.' });
            }
            groupName = `Private Chat - ${members.join('-')}`;
        } else {
            groupName = req.body.groupName; 
            if (!groupName) {
                return res.status(400).json({ message: 'Group name is required for public chat groups.' });
            }
        }
        const newChatGroup = new ChatGroup({
            groupName,
            members,
            isPrivate
        });

        await newChatGroup.save();

        return res.status(201).json({ message: 'Chat group created successfully. ', chatGroup: newChatGroup });
    } catch (error) {
        console.error('Error creating chat group:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.getChatGroups = async (req, res) => {
  try {
    const chatGroups = await ChatGroup.find().populate('members', 'name email'); // Populate member details

      return res.status(200).json(chatGroups);
  } catch (error) {
      console.error('Error fetching chat groups:', error);
      return res.status(500).json({ message: 'Server error.' });
  }
};

exports.getChatGroupById = async (req, res) => {
  try {
      const { id } = req.params;

      const chatGroup = await ChatGroup.findById(id).populate('members', 'name email');

      if (!chatGroup) {
          return res.status(404).json({ message: 'Chat group not found.' });
      }

      return res.status(200).json(chatGroup);
  } catch (error) {
      console.error('Error fetching chat group:', error);
      return res.status(500).json({ message: 'Server error.' }); 
  }
};
exports.getChatGroupById = async (req, res) => { 
  try {
      const { id } = req.params;  

      const chatGroup = await ChatGroup.findById(id).populate('members', 'name email');

      if (!chatGroup) {
          return res.status(404).json({ message: 'Chat group not found.' });
      }

      return res.status(200).json(chatGroup);
  } catch (error) {
      console.error('Error fetching chat group:', error);
      return res.status(500).json({ message: 'Server error.' });
  }
};


exports.deleteChatGroup = async (req, res) => {
  try {
      const { id } = req.params;

      // Find and delete the chat group
      const chatGroup = await ChatGroup.findByIdAndDelete(id);

      if (!chatGroup) {
          return res.status(404).json({ message: 'Chat group not found.' });
      }

      // Delete all associated chat messages
      await ChatMessage.deleteMany({ chatGroup: id });

      return res.status(200).json({ message: 'Chat group and associated messages deleted successfully.' });
  } catch (error) {
      console.error('Error deleting chat group and messages:', error);
      return res.status(500).json({ message: 'Server error.' });
  }
};


exports.addMemberToChatGroup = async (req, res) => {
  try {
      const { id } = req.params; // Chat group ID
      const { memberId } = req.body; // New member ID

      const chatGroup = await ChatGroup.findById(id);

      if (!chatGroup) {
          return res.status(404).json({ message: 'Chat group not found.' });
      }

      // Add member if they are not already in the group
      if (!chatGroup.members.includes(memberId)) {
          chatGroup.members.push(memberId);
          await chatGroup.save();
          return res.status(200).json({ message: 'Member added to chat group.', chatGroup });
      } else {
          return res.status(400).json({ message: 'Member is already in the chat group.' });
      }
  } catch (error) {
      console.error('Error adding member to chat group:', error);
      return res.status(500).json({ message: 'Server error.' });
  }
};

exports.removeMemberFromChatGroup = async (req, res) => { 
  try {
      const { id } = req.params; // Chat group ID
      const { memberId } = req.body; // Member ID to remove

      const chatGroup = await ChatGroup.findById(id);
 
      if (!chatGroup) {
          return res.status(404).json({ message: 'Chat group not found.' });
      }

      // Remove member if they are in the group
      if (chatGroup.members.includes(memberId)) {
          chatGroup.members.pull(memberId);
          await chatGroup.save();
          return res.status(200).json({ message: 'Member removed from chat group.', chatGroup });
      } else {
          return res.status(400).json({ message: 'Member is not in the chat group.' });
      }
  } catch (error) {  
      console.error('Error removing member from chat group:', error);
      return res.status(500).json({ message: 'Server error.' });
  }
};


// Update the chat group's name
exports.updateChatGroup = async (req, res) => {
    try {
        const { id } = req.params; // Chat group ID
        const { groupName } = req.body; // New group name

        // Validate input
        if (!groupName) {
            return res.status(400).json({ message: 'Group name is required.' });
        }

        // Find the chat group by ID
        const chatGroup = await ChatGroup.findById(id);

        if (!chatGroup) {
            return res.status(404).json({ message: 'Chat group not found.' });
        }

        // Update the group name
        chatGroup.groupName = groupName;

        // Save changes
        await chatGroup.save();

        return res.status(200).json({ message: 'Chat group updated successfully.', chatGroup });
    } catch (error) {
        console.error('Error updating chat group:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


// Controller function to get chat group by member ID

// Controller function to get chat group by two member IDs
exports.getChatGroupByMemberIds = async (req, res) => {
    try {
      const { memberId1, memberId2 } = req.params;
  
      // Find private chat groups that include both member IDs
      const chatGroup = await ChatGroup.findOne({
        members: { $all: [memberId1, memberId2] },
        isPrivate: true,
      });
  
      // Return structured value with a flag and optional chatGroupId
      if (!chatGroup) {
        return res.status(200).json({ success: false, chatGroupId: null });
      }
  
      return res.status(200).json({ success: true, chatGroupId: chatGroup._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
  

 // Controller function to get all chat groups by current member ID
exports.getChatGroupsByCurrentMemberId = async (req, res) => {
    try {
        const { currentMemberId } = req.params;

        // Find all chat groups that include the current member ID
        const chatGroups = await ChatGroup.find({
            members: currentMemberId // Use currentMemberId directly
        }) .populate('members');

        // Return structured value with success flag and chat groups
        if (chatGroups.length === 0) {
            return res.status(200).json({ success: true, chatGroups: [] });
        }

        return res.status(200).json({ success: true, chatGroups });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
