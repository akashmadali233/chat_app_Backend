module.exports = (sequelize, DataTypes) => {
  const UserChats = sequelize.define('UserChats', {
    userId: {
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

  return UserChats;
};
