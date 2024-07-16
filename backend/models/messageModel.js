module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    chatId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Chats',
        key: 'id'
      }
    }
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'senderId' });
    Message.belongsTo(models.Chat, { foreignKey: 'chatId' });
  };

  return Message;
};
