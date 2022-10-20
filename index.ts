import { Telegraf, Composer, session, Scenes } from "telegraf";
import dotenv from "dotenv";
import cli, { xterm } from "cli-color";
import fs from "fs";
const botFather = require("./utility/botfather");
const db = require("./model/index");
const User = db.user;
const proyekt = db.proyekt;
const Tarif = db.tarif;
const Channel = db.channel;
const xato = require("./utility/kerakli");
interface forward_from {
  id: bigint;
  title: string;
  is_bot: boolean;
  username: string;
  first_name: string;
}

/** Composerlarni FUnksiya Funksiya qilib Olayapman*/
const newPro = require("./controller/newProyekt");
const newProyekts = require("./controller/newWizart");
const proyektOptions = require("./controller/proyektOption");
const Options = require("./controller/option");
const Connections = require("./controller/Connection");
const Tarifs = require("./controller/tarif");
const tarifNames = require("./controller/tarifName");
dotenv.config({ path: ".env" });
require("./model");

const TOKEN = String(process.env.TOKEN);

const bot = new Telegraf(TOKEN);

const newWizart = new Composer();

newWizart.hears("Yordam", async (ctx: any) => {
  await newProyekts.Yordam(ctx);
});
newWizart.hears("Proyektlar", async (ctx) => {
  await newProyekts.Proyektlar(ctx, User, proyekt);
});
newWizart.hears("To'lovlar", async (ctx: any) => {
  await newProyekts.Tolovlar(ctx);
});
newWizart.hears("Sozlamalar", async (ctx) => {
  await newProyekts.Sozlamalar(ctx);
});
newWizart.hears(/\b[a-zA-Z0-9]\b/gu, async (ctx: any) => {
  await xato(ctx);
});
const newProyekt = new Composer();
newProyekt.action("newproyekt", async (ctx: any) => {
  await newPro.newProject(ctx);
});
newProyekt.hears(/\b[a-zA-Z0-9]/gu, async (ctx: any) => {
  await newPro.xatolar(ctx);
});
const proyektOption = new Composer();
proyektOption.action("money", async (ctx: any) => {
  await proyektOptions.Money(ctx);
});
proyektOption.action("donat", async (ctx: any) => {
  await proyektOptions.Donat(ctx);
});
proyektOption.action("cancel", async (ctx: any) => {
  await proyektOptions.Cancels(ctx);
});

proyektOption.hears(/\b[a-zA-Z0-9]+/gu, async (ctx: any) => {
  await newPro.xatolar(ctx);
});
const option = new Composer();
option.on("text", async (ctx: any) => {
  await Options.TextFunction(ctx, User, proyekt);
});
option.action("cancel", async (ctx: any) => {
  await Options.Cancel(ctx);
});
option.action("channel", async (ctx: any) => {
  await Options.Channel(ctx);
});

option.action("group", async (ctx: any) => {
  await Options.Group(ctx);
});
option.action("back", async (ctx: any) => {
  await Options.Back(ctx);
});

const Connection = new Composer();

Connection.on("text", async (ctx: any) => {
  Connections.textFunc(ctx, User, proyekt, Channel);
});

Connection.action("newTarif", async (ctx: any) => {
  await Connections.NewTarif(ctx);
});
Connection.action("cancel", async (ctx: any) => {
  await Connections.Cancel(ctx);
});

const tarif = new Composer();
tarif.on("callback_query", async (ctx: any) => {
  await Tarifs.calBack(ctx, User, proyekt, Tarif);
});

const tarifName = new Composer();
tarifName.on("text", async (ctx: any) => {
  await tarifNames.textFunc(ctx, User, proyekt, Channel);
});

const currency = new Composer();
const currencys = require("./controller/currency");
currency.action("cancel", async (ctx: any) => {
  await currencys.Cancel(ctx);
});
currency.on("text", async (ctx: any) => {
  await currencys.textFunc(ctx, User, proyekt, Tarif);
});

const description = new Composer();
const descript = require("./controller/description");
description.on("callback_query", async (ctx: any) => {
  await descript.calBack(ctx, User, Tarif, Channel);
});

const botConfirm = new Composer();
const botConfirms = require("./controller/botConfirm");
Connection.action("newtarif", async (ctx: any) => {
  await Connections.NewTarif(ctx);
});
Connection.action("cancel", async (ctx: any) => {
  await Connections.Cancel(ctx);
});
botConfirm.on("callback_query", async (ctx: any) => {
  await botConfirms.calBack(ctx);
});

botConfirm.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  try {
    // console.log(message);
    const botullo = new botFather(message, bot);
    botullo.start();

    const user = await User.findOne({ where: { telegramId: id, activ: true } });
    console.log(user);
    const project = await proyekt.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
    console.log(project);

    const projectId = project[0].dataValues.id;
    const projectUpdate = await proyekt.update(
      {
        token: message,
      },
      {
        where: {
          id: projectId,
        },
      }
    );

    await ctx.telegram.sendMessage(
      id,
      "Bot tokeni muvaffaqiyatli saqlandi",
      {}
    );
  } catch (e) {
    return await ctx.telegram.sendMessage(id, "Bot tokeni noto'g'ri kiritildi");
  }

  return ctx.scene.enter("sceneWizard");
});
const menuSchema: any = new Scenes.WizardScene(
  "sceneWizard",
  newWizart,
  newProyekt,
  proyektOption,
  option,
  Connection,
  tarif,
  tarifName,
  currency,
  description,
  botConfirm
);

const stage: any = new Scenes.Stage([menuSchema]);
bot.use(session());
bot.use(stage.middleware());
bot.start(async (ctx: any) => {
  // console.log(ctx.telegram);
  const name =
    ctx.update.message.from.username || ctx.update.message.from.first_name;
  const id = ctx.update.message.from.id;

  let user = await User.findOne({
    where: {
      telegramId: id,
    },
  });
  // console.log(user);
  if (!user) {
    user = await User.create({
      username: name,
      telegramId: id,
    });
  } else {
    // await User.update({ username: name }, { where: { telegramId: id } });
  }
  // console.log(user);

  ctx.telegram.sendMessage(
    id,
    `🖐 Xush kelibsiz, ${name}! Kanalni monetizatsiya qilish haqida o'ylab ko'rganmisiz? Yoki xayr-ehsonlarni ulashni xohlaysizmi? :)`,
    {
      reply_markup: {
        keyboard: [
          [{ text: "Proyektlar" }, { text: "To'lovlar" }],
          [{ text: "Sozlamalar" }, { text: "Yordam" }],
        ],
        resize_keyboard: true,
      },
    }
  );
  return ctx.scene.enter("sceneWizard");
});
const mychat = require("./controller/mychat");
bot.on("my_chat_member", async (ctx: any) => {
  await mychat.mychat(ctx, User, Channel);
});
console.log("Bot is running");
bot.launch();
