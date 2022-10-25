const tarifUser = (sequilize: any, DataTypes: any) => {
  const tarifUser = sequilize.define(
    "tarifUser",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      connectUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "connectusers",
          key: "id",
        },
      },
      tarifId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tarif",
          key: "id",
        },
      },
      proyektId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "proyekt",
          key: "id",
        },
      },
    },
    {
      tableName: "tarifUser",
    }
  );
  return tarifUser;
};
module.exports = tarifUser;
