module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique : true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING,
      defaultValue: "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg",
      allowNull: false
    }
  });

  // User.associate = function(models) {
  //   User.belongsToMany(models.chat, { through: 'ChatUsers', as: 'chats', foreignKey: 'userId' });
  //   User.hasMany(models.message, { as: 'messages', foreignKey: 'sender' });
  // };

  return User;
};
