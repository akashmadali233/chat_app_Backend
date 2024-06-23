// models/chatModel.js

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    chatName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    latestMessageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'messages',
        key: 'id'
      }
    },
    groupAdminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  // Chat.associate = function(models) {
  //   Chat.belongsToMany(models.user, { through: 'ChatUsers', as: 'users', foreignKey: 'chatId' });
  //   Chat.belongsTo(models.message, { as: 'latestMessage', foreignKey: 'latestMessageId' });
  //   Chat.belongsTo(models.user, { as: 'groupAdmin', foreignKey: 'groupAdminId' });
  // };

  return Chat;
};
