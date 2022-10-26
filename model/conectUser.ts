const connectUser = (sequelize: any, DataTypes: any) => {
  const user = sequelize.define("connectuser", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telegramId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    channelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "channel",
        key: "id",
      },
    },
    expiresDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activ: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    proyektId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "proyekt",
        key: "id",
      },
    },
    editTarif: {
      type: DataTypes.STRING,
    },
  });
  return user;
};
module.exports = connectUser;
