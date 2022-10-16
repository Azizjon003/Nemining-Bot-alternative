const channel = (sequelize: any, DataTypes: any) => {
  const channel = sequelize.define(
    "channel",
    {
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
      type: {
        type: DataTypes.ENUM,
        values: ["channel", "group"],
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        refrences: {
          model: "user",
          key: "id",
        },
      },
      proyektId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        refrences: {
          model: "proyekt",
          key: "id",
        },
      },
      activ: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "channel",
    }
  );
  return channel;
};
module.exports = channel;
