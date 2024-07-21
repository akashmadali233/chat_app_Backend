const { parse } = require('dotenv');
const db = require('../models');
const { Sequelize } = db;
const { Op, json } = require('sequelize');

const User = db.User;
const Chat = db.Chat;
const Message = db.Message;

const accessChat = async (req, res) => { 
    const currentUserId = req.user.id;
    const { userId }= req.body;
    if(!userId){
        return res.status(400).json({'userId': "UserId required"});
    }

  try {
        let chat = await Chat.findOne({
            where: {
                isGroupChat: false,
                [Op.and]: [
                    Sequelize.literal(`JSON_CONTAINS(users, '${JSON.stringify([String(currentUserId)])}', '$')`),
                    Sequelize.literal(`JSON_CONTAINS(users, '${JSON.stringify([String(userId)])}', '$')`)
                ]
            }
        });
        let users = [];

        if (chat) {
            users = await User.findAll({
                where: { id: { [Op.in]: chat.users } },
                attributes: ['id', 'name', 'email', 'pic', 'createdAt', 'updatedAt']
            });
        } else {
            const chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [currentUserId, userId].map(String) 
            };

            chat = await Chat.create(chatData);

            users = await User.findAll({
                where: { id: { [Op.in]: chat.users } },
                attributes: ['id', 'name', 'email', 'pic', 'createdAt', 'updatedAt']
            });
        }

        const formattedChat = {
            id: chat.id,
            chatName: chat.chatName,
            isGroupChat: chat.isGroupChat,
            users: users,
            updatedAt: chat.updatedAt,
            createdAt: chat.createdAt
        };

        res.status(200).json(formattedChat);

    } catch (error) {
        console.error('Error querying Chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const fetchChats = async (req, res) => {
  try {
        const currentUserId = req.user.id; 
        
        const chats = await Chat.findAll({
        where: {
            [Op.or]: [
            Sequelize.literal(`JSON_CONTAINS(users, '${JSON.stringify([String(currentUserId)])}', '$')`)
            ]
        }
        });

        
        let formatedDataDetails = [];
        
        for(const chat of chats){
            let userDetails = [];
            let adminDetails = [];
            
            for(const user of chat.users){
                const userData = await User.findOne({
                    where : {
                        id : user
                    }
                })

                if(user == chat.groupAdminId){
                    adminDetails.push(userData);
                }else{
                    userDetails.push(userData)
                }
            }
            
            const messageDetails = await Message.findOne({
                where :{
                    id : chat.latestMessageId
                }
            })
            //formatedDataDetails.push(messageDetails)
            if(messageDetails != null){
                var senderDetails = await User.findOne({where : { id : messageDetails.senderId}})
            }
            
            var latestMessage = {
                id : messageDetails ? messageDetails.id : null,
                sender : senderDetails ? senderDetails:null,
                content : messageDetails ? messageDetails.content : null,
                chat : chat.id,
                createdAt : messageDetails ? messageDetails.createdAt : null,
                updatedAt : messageDetails ? messageDetails.updatedAt : null
            }

            var formatedData = {
                id : chat.id,
                chatName : chat.chatName,
                isGroupChat : chat.isGroupChat,
                users : userDetails,
                groupAdmin : adminDetails,
                createdAt :  chat.createdAt,
                updatedAt :  chat.updatedAt,
                latestMessage : latestMessage ? latestMessage : null,
            }
            formatedDataDetails.push(formatedData);
        }

        res.status(200).json(formatedDataDetails );

    } catch (error) {
        console.error('Error querying Chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).json({ message: "More than 2 users are needed to form a group chat" });
    }
    users.push(String(req.user.id));

    try {
        let userData = [];
        users.forEach(user => {
            userData.push(String(user));
        })
        const chatData = {
            chatName: req.body.name,
            isGroupChat: true,
            users: userData,
            groupAdminId: req.user.id
        };

        const groupChat = await Chat.create(chatData);

        let userDetails = [];
        let adminDetails = [];
        for (let i = 0; i < groupChat.users.length; i++) {
            var user = await User.findByPk(groupChat.users[i]);
            if (groupChat.users[i] == req.user.id) {
                adminDetails.push(user);
            } else {
                userDetails.push(user);
            }         
        }

        res.json({ id: groupChat.id,
            chatName: groupChat.chatName, 
            isGroupChat: true,
            users: userDetails,
            groupAdmin: adminDetails,
            createdAt: groupChat.createdAt,
            updatedAt: groupChat.updatedAt 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create group chat" });
    }
}

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
        return res.status(400).json({ message: 'chatId and chatName are required' });
    }

    try {
        const [updatedCount] = await Chat.update({ chatName: chatName }, {
            where: { 
                id: chatId,
                isGroupChat: true
            }
        });

        if (updatedCount === 1) {
            const groupDetails = await Chat.findByPk(chatId);

            let userDetails = [];
            let adminDetails = [];

            for (let i = 0; i < groupDetails.users.length; i++) {
                const eachUser = await User.findByPk(groupDetails.users[i]);
                if (groupDetails.users[i] == groupDetails.groupAdminId) {
                    adminDetails.push(eachUser);
                } else {
                    userDetails.push(eachUser);
                }
            }

            const formattedChat = {
                id: groupDetails.id,
                chatName: groupDetails.chatName,
                isGroupChat: true,
                users: userDetails,
                groupAdmin: adminDetails,
                createdAt: groupDetails.createdAt,
                updatedAt: groupDetails.updatedAt
            };

            return res.status(200).json(formattedChat);
        } else {
            return res.status(404).json({ message: 'Chat not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating chat:', error);
        return res.status(500).json({ message: 'Failed to update chat' });
    }
};

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ message: 'chatId and userId are required' });
    }

    try {
        const groupChat = await Chat.findByPk(chatId);
        if (!groupChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        const users = groupChat.users;
        if (users.includes(userId)) {
            return res.status(400).json({ message: 'User is already in the group' });
        }
        users.push(String(userId));

        await Chat.update({ users: users }, {
            where: { 
                id: chatId,
                isGroupChat: true
            }
        });

        let userDetails = [];
        let adminDetails = [];

        for (let i = 0; i < users.length; i++) {
            const eachUser = await User.findByPk(users[i]);
            if (users[i] == groupChat.groupAdminId) {
                adminDetails.push(eachUser);
            } else {
                userDetails.push(eachUser);
            }
        }

        const formattedChat = {
            id: groupChat.id,
            chatName: groupChat.chatName,
            isGroupChat: true,
            users: userDetails,
            groupAdmin: adminDetails,
            createdAt: groupChat.createdAt,
            updatedAt: new Date() 
        };

        return res.status(200).json(formattedChat);
    } catch (error) {
        console.error('Error adding user to group:', error);
        return res.status(500).json({ message: 'Failed to add user to group' });
    }
};


const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ message: 'chatId and userId are required' });
    }

    try {
        const groupChat = await Chat.findByPk(chatId);
        if (!groupChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const users = groupChat.users;
        const userIdStr = String(userId);
        const updatedUsers = users.filter(user => user !== userIdStr);

        if (updatedUsers.length === users.length) {
            return res.status(400).json({ message: 'User is not in the group' });
        }

        await Chat.update({ users: updatedUsers }, {
            where: { 
                id: chatId,
                isGroupChat: true
            }
        });

        let userDetails = [];
        let adminDetails = [];

        for (let i = 0; i < updatedUsers.length; i++) {
            const eachUser = await User.findByPk(updatedUsers[i]);
            if (updatedUsers[i] == groupChat.groupAdminId) {
                adminDetails.push(eachUser);
            } else {
                userDetails.push(eachUser);
            }
        }

        const formattedChat = {
            id: groupChat.id,
            chatName: groupChat.chatName,
            isGroupChat: true,
            users: userDetails,
            groupAdmin: adminDetails,
            createdAt: groupChat.createdAt,
            updatedAt: new Date()
        };

        return res.status(200).json(formattedChat);
    } catch (error) {
        console.error('Error removing user from group:', error);
        return res.status(500).json({ message: 'Failed to remove user from group' });
    }
};


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};
