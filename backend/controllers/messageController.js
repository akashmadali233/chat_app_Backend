const db = require('../models');
const Message = db.Message;
const User = db.User;
const Chat = db.Chat;

const sendMessage = async (req, res) => {
    const { content, chatId} = req.body;
    
    if (!content || !chatId) {
        return res.status(400).json({
            message: "Required both content and chatId"
        });
    }

    const newMessage = {
        senderId: req.user.id,
        content: content,
        chatId: chatId
    };

    try {
        // Ensure the chat exists
        const chatDetails = await Chat.findOne({
            where: { id: chatId }
        });

        if (!chatDetails) {
            return res.status(404).json({
                message: 'Chat Detail is Not found'
            });
        }

        // Create the new message
        const message = await Message.create(newMessage);

        // Ensure chatDetails.users is an array before using filter
        if (!Array.isArray(chatDetails.users)) {
            return res.status(500).json({
                message: 'Invalid chat details'
            });
        }

        // Fetch the users in a single query
        const userDetails = await User.findAll({
            where: {
                id: chatDetails.users.filter(id => id !== chatDetails.groupAdminId)
            }
        });

        if (!userDetails) {
            return res.status(404).json({
                message: 'Users not found'
            });
        }

        // Find sender details separately
        const senderDetails = await User.findByPk(req.user.id);

        if (!senderDetails) {
            return res.status(404).json({
                message: 'Sender not found'
            });
        }

        // Update the chat with the latest message ID
        await Chat.update(
            { latestMessageId: message.id },
            { where: { id: chatId } }
        );

        // Fetch the updated chat details
        const updatedChatDetails = await Chat.findOne({
            where: { id: chatId }
        });

        const formatted = {
            sender: {
                id: senderDetails.id,
                name: senderDetails.name,
                pic: senderDetails.pic
            },
            content: content,
            chat: {
                id: updatedChatDetails.id,
                chatName: updatedChatDetails.chatName,
                isGroupChat: updatedChatDetails.isGroupChat,
                users: userDetails,
                groupAdminId: updatedChatDetails.groupAdminId,
                createdAt: updatedChatDetails.createdAt,
                updatedAt: updatedChatDetails.updatedAt,
                latestMessageId: message.id
            }
        };

        res.status(200).json(formatted);

    } catch (error) {
        console.error('Error sending message:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Invalid chatId, chat does not exist' });
        }
        return res.status(500).json({ message: 'Failed to send message' });
    }
};



const allMessage = async (req, res) => {
    try {
        const chatID = req.params.chatId;

        const messages = await Message.findAll({
            where : {
                chatId : chatID
            }
        })

        let dataDetails = [];
        for (const message of messages){
            const senderDetails  = await User.findOne({where : {id : message.senderId}})
            const chatDetails = await Chat.findOne({where : { id : chatID}})
            const data = { 
                id : message.id,
                sender : senderDetails,
                content : message.content,
                chat : chatDetails,
                createdAt : message.createdAt,
                updatedAt : message.updatedAt
            }

            dataDetails.push(data);
        }

        res.status(200).json(dataDetails);
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Failed to send message' });
    }
}


module.exports = {sendMessage, allMessage};