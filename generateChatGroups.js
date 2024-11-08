const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path as necessary
const ChatGroup = require('./models/ChatGroup'); // Adjust path as necessary

async function generateChatGroups() {
    try {
        // Step 1: Check if the group chat "ECU" exists
        let groupChat = await ChatGroup.findOne({ name: 'ECU' });

        // Step 2: If it doesn't exist, create it
        if (!groupChat) {
            const allMembers = await User.find({}).select('_id'); // Retrieve all users
            groupChat = await ChatGroup.create({
                name: 'ECU',
                members: allMembers
            });
        }

        // Step 3: Find users who do not have any chat group
        const users = await User.find();
        const userIds = users.map(user => user._id);

        for (const user of users) {
            // Check if the user is part of any chat group
            const chatGroupsForUser = await ChatGroup.find({ members: user._id });

            if (chatGroupsForUser.length === 0) {
                // Step 4: Create private chat groups for users not in any chat group
                const otherMembers = userIds.filter(id => !id.equals(user._id)); // Exclude the current user

                for (const otherId of otherMembers) {
                    // Create a private chat group between the user and the other user
                    await ChatGroup.create({
                        name: `Chat_${user._id}_${otherId}`, // Unique name for the chat
                        members: [user._id, otherId], 
                        isPrivate: true
                    });
                }
            }
        }

        console.log('Chat groups generated successfully.');
    } catch (error) {
        console.error('Error generating chat groups:', error);
    }
} 

module.exports = generateChatGroups; // Ensure this line is present
