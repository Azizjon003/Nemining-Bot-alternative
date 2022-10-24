const payment = (sequelize: any, DataTypes: any) => {
  const payment = sequelize.define("payment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tarif: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cardNum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return payment;
};

module.exports = payment;
