const tarif = (sequelize: any, DataTypes: any) => {
  const tarif = sequelize.define(
    "tarif",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expires: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
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
      activ: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["channel", "group"],
      },
    },
    {
      tableName: "tarif",
    }
  );

  return tarif;
};

module.exports = tarif;
