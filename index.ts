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
newProyekt.action("editproyekt", async (ctx: any) => {
  await newPro.editProyekt(ctx, User, proyekt);
});
newProyekt.action(/\btarif/, async (ctx: any) => {
  await newPro.tarifEdit(ctx, User, proyekt, Tarif);
});
newProyekt.on("callback_query", async (ctx: any) => {
  await newPro.callBackFunc(ctx, User, proyekt);
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
proyektOption.action(/\btarif/, async (ctx: any) => {
  await proyektOptions.editTarifOption(ctx, User, proyekt, Tarif);
});
proyektOption.action(/\bname/, async (ctx: any) => {
  await proyektOptions.editTarifName(ctx, Tarif, User);
});
proyektOption.action(/\bprice/, async (ctx: any) => {
  await proyektOptions.editTarifPrice(ctx, Tarif, User);
});
proyektOption.action(/\btime/, async (ctx: any) => {
  await proyektOptions.editTarifTime(ctx, Tarif, User);
});

proyektOption.on("text", async (ctx: any) => {
  await newPro.editName(ctx, User, proyekt);
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
  Connections.TextFunc(ctx, User, proyekt, Channel);
});

Connection.action("newTarif", async (ctx: any) => {
  await Connections.newTarif(ctx);
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
  await tarifNames.textFunc(ctx, User, Tarif);
});

const currency = new Composer();
const currencys = require("./controller/currency.ts");
currency.action("cancel", async (ctx: any) => {
  await currencys.Cancel(ctx);
});
currency.on("text", async (ctx: any) => {
  await currencys.textFunc(ctx, User, Tarif);
});

const description = new Composer();
const descript = require("./controller/description.ts");
description.on("callback_query", async (ctx: any) => {
  await descript.callBack(ctx, User, Tarif, Channel);
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
  await botConfirms.callBack(ctx);
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
const editTarifOption = new Composer();
editTarifOption.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const shart = user.editTarif.split(":")[0];
  if (shart == "name") {
    const tarifId = user.editTarif.split(":")[1];
    const tarifUpdate = await Tarif.update(
      {
        name: message,
      },
      {
        where: {
          id: tarifId,
        },
      }
    );

    await ctx.telegram.sendMessage(
      id,
      "Tarif nomi muvaffaqiyatli o'zgartirildi"
    );
    return ctx.scene.leave();
  }
  if (shart == "price") {
    const tarifId = user.editTarif.split(":")[1];
    if (!Number(message)) {
      return ctx.telegram.sendMessage(id, "Noto'g'ri qiymat kiritildi");
    }
    const tarifUpdate = await Tarif.update(
      {
        price: message,
      },
      {
        where: {
          id: tarifId,
        },
      }
    );

    await ctx.telegram.sendMessage(
      id,
      "Tarif narxi muvaffaqiyatli o'zgartirildi"
    );
    return ctx.scene.leave();
  }
  if (shart == "time") {
    const tarifId = user.editTarif.split(":")[1];
    if (!Number(message)) {
      return ctx.telegram.sendMessage(id, "Noto'g'ri qiymat kiritildi");
    }
    const tarifUpdate = await Tarif.update(
      {
        expires: message,
      },
      {
        where: {
          id: tarifId,
        },
      }
    );

    await ctx.telegram.sendMessage(
      id,
      "Tarif vaqti muvaffaqiyatli o'zgartirildi"
    );
    return ctx.scene.leave();
  }
});
const editProjectName = new Composer();
editProjectName.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const proyektId = user.editTarif;
  console.log(user);
  const projectUpdate = await proyekt.update(
    {
      name: message,
    },
    {
      where: {
        id: proyektId,
      },
    }
  );

  await ctx.telegram.sendMessage(
    id,
    "Proyekt nomi muvaffaqiyatli o'zgartirildi"
  );
  return ctx.scene.leave();
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
  botConfirm,
  editTarifOption,
  editProjectName
);

const stage: any = new Scenes.Stage([menuSchema]);
bot.use(session());
bot.use(stage.middleware());
const start = require("./controller/start");
bot.start(async (ctx: any) => {
  await start.start(ctx, User);
});
const mychat = require("./controller/mychat");
bot.on("my_chat_member", async (ctx: any) => {
  await mychat.mychat(ctx, User, Channel);
});
console.log("Bot is running");
bot.launch();
