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
        allowNull: false,
      },
      expires: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
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
