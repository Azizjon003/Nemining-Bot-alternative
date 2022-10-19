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

// db.sequelize
//   .sync({ alter: true, force: true })
//   .then(() => {
//     console.log(cli.green("synced"));
//   })
//   .catch((err: any) => {
//     console.log(cli.red(err));
//   });
module.exports = db;
