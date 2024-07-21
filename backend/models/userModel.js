module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      //unique: true,
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

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'senderId' });
    User.hasMany(models.Chat, { foreignKey: 'groupAdminId' });
  };

  return User;
};
