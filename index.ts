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
currency.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Sizning loyihalaringiz ro'yxati: \n",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Yangi Proyekt Yaratish",
              callback_data: `newproyekt`,
            },
          ],
        ],
      },
    }
  );
  return ctx.wizard.back().back().back().back().back();
});
currency.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const text = ctx.update.message.text;
  if (!Number(text)) {
    return await ctx.telegram.sendMessage(id, "Iltimos son kiriting");
  }
  console.log(cli.red(text));
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  console.log(user.id);
  const tarifOp = await Tarif.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  const tarifId = tarifOp[0].dataValues.id;
  console.log(tarifId);
  if (!tarifId) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }
  console.log(tarifId);
  const tarif = await Tarif.update(
    {
      price: text,
    },
    {
      where: {
        id: tarifId,
      },
    }
  );

  const dataArr = JSON.parse(fs.readFileSync("./date.json", "utf-8"));
  console.log(dataArr);
  await ctx.telegram.sendMessage(
    id,
    "Tarif summasi muvaffaqiyatli saqlandi,Siz Kerakli vaqtni tanlang",
    {
      reply_markup: {
        inline_keyboard: dataArr,
      },
    }
  );
  return ctx.wizard.next();
});

const description = new Composer();

description.on("callback_query", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const data = ctx.update.callback_query.data;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const tarifOp = await Tarif.findAll({ where: { userId: user.id } });
  const tarifId = tarifOp[0].dataValues.id;
  if (!tarifId) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }
  const tarif = await Tarif.update(
    {
      time: data,
    },
    {
      where: {
        id: tarifId,
      },
    }
  );
  console.log(tarif);
  if (!tarif) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }
  const channel = await Channel.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  console.log(channel);
  const name = channel?.name;

  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    `Tarif rejasi tasdiqlandi va <b>${name}</b> kanaliga ulandi`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Yana Tarif reja qo'shish", callback_data: "newtarif" }],
          [{ text: "Tasdiqlash", callback_data: "confirm" }],
          [{ text: "Bekor qilish", callback_data: "cancel" }],
        ],
      },
    }
  );
  return ctx.wizard.next();
});

const botConfirm = new Composer();
Connection.action("newtarif", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const dataArr = JSON.parse(fs.readFileSync("./currency.json", "utf-8"));
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Valyutani tanlang",
    {
      reply_markup: {
        inline_keyboard: dataArr,
      },
    }
  );
  return ctx.wizard.back().back().back().back();
});
Connection.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Sizning loyihalaringiz ro'yxati: \n",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Yangi Proyekt Yaratish",
              callback_data: `newproyekt`,
            },
          ],
        ],
      },
    }
  );
  return ctx.wizard.back().back().back().back().back().back();
});
botConfirm.on("callback_query", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const data = ctx.update.callback_query.data;
  if (data == "confirm") {
    const text = `Endi siz obunachilaringiz muloqot qiladigan shaxsiy botingizni ulashingiz kerak.\nBuning uchun:\n1. Botlarning otasini oching - @BotFather\n2. Yangi bot yarating (buyruq/newbot)\n3. Ota sizga shaxsiy botingizning API tokenini yuboradi (format 123456789:ASDFABC-DEF1234gh) - bu tokenni nusxalab, menga yuboring.\nMuhim! Boshqa xizmatga (yoki boshqa botlarga) ulangan botdan foydalanmang!\nMen tokenni kutyapman...`;
    await ctx.telegram.editMessageText(id, messageId, updateId, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Loyihani Bekor Qilish", callback_data: "cancel" }],
        ],
      },
    });
  }
  // return ctx.wizard.next();
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

bot.on("my_chat_member", async (ctx: any) => {
  // console.log(ctx.update.my_chat_member);
  const userId = ctx.update.my_chat_member.from.id;
  const chatId = ctx.update.my_chat_member.chat.id;
  const test = ctx.update.my_chat_member.new_chat_member.status;
  const name = ctx.update.my_chat_member.chat.title;
  const chatType = ctx.update.my_chat_member.chat.type;
  const user = await User.findOne({
    where: { telegramId: userId },
  });
  if (!user) {
    return await ctx.telegram.sendMessage(
      chatId,
      `Siz ro'yxatdan o'tmadingiz!`
    );
  }
  // console.log(test);
  if (test == "left") {
    Channel.update(
      {
        activ: false,
      },
      {
        where: {
          telegramId: chatId,
        },
      }
    );
  }
  if (test == "kicked") {
    Channel.update(
      {
        activ: false,
      },
      {
        where: {
          telegramId: chatId,
        },
      }
    );
  }
  if (test == "administrator") {
    const chanel = await Channel.create({
      name: name,
      telegramId: chatId * 1,
      type: chatType,
      userId: user.id,
    });
  }
});
console.log("Bot is running");
bot.launch();
