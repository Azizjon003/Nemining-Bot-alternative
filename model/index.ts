const { Sequelize, DataTypes, Op } = require("sequelize");
import dotenv from "dotenv";
dotenv.config({});
import cli from "cli-color";

const sequelize = new Sequelize(
  process.env.DB,
  "postgres",
  String(process.env.DB_PASS),
  {
    host: "localhost",
    dialect: "postgres",
  }
);
interface data {
  sequelize: any;
  user: any;
  channel: any;
}

sequelize
  .authenticate()
  .then(() => {
    console.log(cli.green("connected"));
  })
  .catch((err: any) => {
    console.log(cli.red("not connected"));
  });

let db: any = {} as data;
db.sequelize = sequelize;
db.Op = Op;

db.user = require("./user")(sequelize, DataTypes);
db.channel = require("./kanal")(sequelize, DataTypes);
db.tarif = require("./tarif")(sequelize, DataTypes);
db.proyekt = require("./proyekt")(sequelize, DataTypes);
db.payment = require("./payment")(sequelize, DataTypes);
db.connectUser = require("./conectUser")(sequelize, DataTypes);
db.tarifUser = require("./tarifUser")(sequelize, DataTypes);

db.user.hasMany(db.proyekt, { foreignKey: "userId" });
db.connectUser.belongsTo(db.channel, { foreignKey: "channelId" });
// db.proyekt.belongsTo(db.user, { foreignKey: "userId" });
// db.proyekt.hasMany(db.user);
// db.user.hasMany(db.proyekt);
// db.sequelize.sync({ alter: true, force: true });

module.exports = db;
