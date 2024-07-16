module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    chatName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    users : {
      type: DataTypes.JSON,
      allowNull : false,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    latestMessageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Messages',
        key: 'id'
      }
    },
    groupAdminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  Chat.associate = (models) => {
    Chat.hasMany(models.Message, { foreignKey: 'chatId' });
    Chat.belongsTo(models.User, { foreignKey: 'groupAdminId', as: 'groupAdmin' });
  };

  return Chat;
};
