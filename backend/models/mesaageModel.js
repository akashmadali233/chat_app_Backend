// models/messageModel.js

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sender: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    chatId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'chats',
        key: 'id'
      }
    }
  });

  // Message.associate = function(models) {
  //   Message.belongsTo(models.user, { as: 'user', foreignKey: 'sender' });
  //   Message.belongsTo(models.chat, { as: 'chat', foreignKey: 'chatId' });
  // };

  return Message;
};
