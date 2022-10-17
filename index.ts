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

interface forward_from {
  id: bigint;
  title: string;
  is_bot: boolean;
  username: string;
  first_name: string;
}
dotenv.config({ path: ".env" });
require("./model");

const TOKEN = String(process.env.TOKEN);

const bot = new Telegraf(TOKEN);

const newWizart = new Composer();
newWizart.hears("Yordam", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(
    id,
    `NEMILIN BOT\n\n<i>Qo'llab-quvvatlash:</i> @Coder_aa\n\n<i>Rasmiy kanal:</i> @musicsnewsuz\n\n<i>Sizning ID raqamingiz:</i> <code>${id}</code>`,
    {
      parse_mode: "HTML",
    }
  );
  // ctx.scene.enter("sceneWizard");
});

newWizart.hears("Proyektlar", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  // console.log(user);
  if (!user) {
    ctx.telegram.sendMessage(id, `Siz ro'yhatdan o'tmagansiz!`, {
      parse_mode: "HTML",
    });
  }
  let text = "";
  const userProyekt = await proyekt.findAll({
    where: { userId: user.id, activ: true },
  });
  // console.log(userProyekt);
  for (let i = 0; i < userProyekt.length; i++) {
    text = String(userProyekt[i].dataValues.name) + "\n" + text;
  }
  await ctx.telegram.sendMessage(
    id,
    `Sizning loyihalaringiz ro'yxati: <i>${text || ""}</i> \n`,
    {
      parse_mode: "HTML",
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
  return ctx.wizard.next();
});
newWizart.hears("To'lovlar", async (ctx: any) => {
  const text = `<i>To'lovlar bo'limi hozircha ishga tushirilmagan! Yaqin kunlarda ishga tushiramiz</i>`;
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(id, text, {
    parse_mode: "HTML",
  });
});
newWizart.hears("Sozlamalar", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const text = `<i>Sozlamalar bo'limi hozircha ishga tushirilmagan! Yaqin kunlarda ishga tushiramiz</i>`;
  ctx.telegram.sendMessage(id, text, {
    parse_mode: "HTML",
  });
});

const newProyekt = new Composer();
newProyekt.action("newproyekt", async (ctx: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;

  const id = ctx.update.callback_query.from.id;

  const text = `💁🏻‍♂️ Siz qanday loyiha yaratmoqchisiz?\n- Pulli obuna: shaxsiy kanal yoki guruhingizga pullik obunani tashkil qilish\n- Donat: Donat qabul qilishni tashkil etish`;

  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Pulli obuna", callback_data: "money" },
          { text: "Donat", callback_data: "donat" },
        ],
        [{ text: "Obunani Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
  return ctx.wizard.next();
});
const proyektOption = new Composer();
proyektOption.action("money", async (ctx: any) => {
  const text = `ℹ️ <i>Agar biror bosqichda xatoga yo'l qo'ysangiz - loyiha yaratishning barcha bosqichlaridan o'ting.
  Keyin har qanday sozlamani o'zgartirishingiz mumkin.</i>
  <b>Yangi loyiha nomini kiriting:
  Misol => Loyiha:Nomi
  </b>`;
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]],
    },
  });
  return ctx.wizard.next({
    state: "E kallangga ",
  });
});
proyektOption.action("donat", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const text = `ℹ️ <i>Loyiha Davom ettirilmoqda...</i>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]],
    },
  });
  return ctx.wizard.next();
});
proyektOption.action("cancel", async (ctx: any) => {
  // console.log(ctx);
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
  return ctx.wizard.back().back();

  // ctx.telegram.editMessageReplyMarkup(id,messageId,,);
  // await ctx.deleteMessage();
});
const option = new Composer();
option.on("text", async (ctx: any) => {
  const message = ctx.update.message.text;
  const id = ctx.update.message.from.id;
  const textMain = `💁‍♀️ Loyiha: <i>${message}</i>

  Endi birinchi resursingizni ulang.

  Siz ham shaxsiy kanal, ham shaxsiy guruh qo'shishingiz mumkin.

  Nimani bog'laysiz?`;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const project = await proyekt.create({
    name: message,
    userId: user.id,
  });
  await ctx.telegram.sendMessage(id, textMain, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Shaxsiy kanal", callback_data: "channel" },
          { text: "Shaxsiy guruh", callback_data: "group" },
        ],
        [{ text: "Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
});
option.action("cancel", async (ctx: any) => {
  // console.log(ctx);
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
  return ctx.wizard.back().back();

  // ctx.telegram.editMessageReplyMarkup(id,messageId,,);
  // await ctx.deleteMessage();
});
option.action("channel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const text = `ℹ️ <i>1.Ulangan kanal administratorlariga meni @Nemilin_bot qo'shing\n2. Ruxsat talab qilinadi A'zolar qo'shing\n3.Menga kanaldan istalgan xabarni yuboring (to'g'ridan-to'g'ri ushbu chatga).
    <b>Kutish Holatida...</b></i>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Orqaga", callback_data: "back" }],
        [{ text: "Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
  // console.log(ctx.stage);
  return ctx.wizard.next({});
});

option.action("group", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const text = `ℹ️ <i>1.Ulangan guruh administratorlariga meni @Nemilin_bot qo'shing\n2. Ruxsat talab qilinadi A'zolar qo'shing\n3.Menga guruhdan istalgan xabarni yuboring (to'g'ridan-to'g'ri ushbu chatga).
    <b>Kutish Holatida...</b></i>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Orqaga", callback_data: "back" }],
        [{ text: "Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
  // console.log(ctx.stage);
  return ctx.wizard.next({});
});
option.action("back", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const textMain = `💁‍♀️ Loyiha: <i>${id}</i>

  Endi birinchi resursingizni ulang.

  Siz ham shaxsiy kanal, ham shaxsiy guruh qo'shishingiz mumkin.

  Nimani bog'laysiz?`;
  ctx.telegram.editMessageText(id, messageId, updateId, textMain, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Shaxsiy kanal", callback_data: "channel" },
          { text: "Shaxsiy guruh", callback_data: "group" },
        ],
        [{ text: "Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
  // return ctx.wizard.back();
});

const Connection = new Composer();

Connection.hears("Group", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const title = ctx.update.message.chat.title;
  const groupId = ctx.update.message.chat.id;
  const username = ctx.update.message.chat?.username;
  if (!username) {
    return await ctx.reply("Ommaviy guruhi ulab bo'lmaydi");
  }
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const ProyektOp = await proyekt.findOne({
    where: { userId: user?.id },
    order: [["createdAt", "DESC"]],
  });
  const proyektId = ProyektOp[0]?.dataValues.id;
  const group = await Channel.findOne({
    where: { name: title, userId: user.id, activ: true },
  });
  if (!group) {
    return await ctx.reply("Ulangan guruh topilmadi");
  }
  const groupOp = await Channel.update(
    {
      proyektId: proyektId,
    },
    {
      where: { name: title, userId: user.id, activ: true },
    }
  );

  const data = await Channel.findOne({
    where: {
      name: title,
    },
  });
  if (data) {
    await ctx.telegram.sendMessage(
      id,
      `Siz muvaffaqiyatli ulandingiz
    ${data.name} Guruhi.
    
    Boshqa resurs qo'shing yoki tarif rejasini yaratishni davom eting:
    tegishli tugmani bosing.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Yangi Resurs qo'shing", callback_data: "newResurs" }],
            [{ text: "Tarif Rejasini yaratish", callback_data: "newTarif" }],
          ],
        },
      }
    );
  }
});
Connection.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const forward = ctx.update.message.forward_from_chat;
  if (forward.username) {
    await ctx.deleteMessage(messageId);
    return await ctx.telegram.sendMessage(
      id,
      "Ommaviy Kanalni ulay olmaysiz iltimos shaxsiy kanalni ulang"
    );
  } else {
    await ctx.deleteMessage(messageId);

    const user = await User.findOne({
      where: {
        telegramId: id,
        activ: true,
      },
    });
    const proyektOp = await proyekt.findAll({
      where: {
        userId: user.id,
        activ: true,
      },
      order: [["createdAt", "DESC"]],
    });
    const proyektId = proyektOp[0].dataValues.id;
    const channelData = await Channel.findOne({
      where: { name: forward.title, userId: user.id, activ: true },
    });
    if (channelData.proyektId) {
      return await ctx.telegram.sendMessage(
        id,
        "Bu kanal boshqa loyihaga ulangan,Boshqa kanalni ulashingiz mumkun"
      );
    }
    const channel = await Channel.update(
      {
        proyektId,
      },
      {
        where: {
          name: forward.title,
        },
      }
    );
    const data = await Channel.findOne({
      where: { name: forward.title },
    });
    if (data) {
      await ctx.telegram.sendMessage(
        id,
        `Siz muvaffaqiyatli ulandingiz
      ${data.name} kanali.
      
      Boshqa resurs qo'shing yoki tarif rejasini yaratishni davom eting:
      tegishli tugmani bosing.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Yangi Resurs qo'shing", callback_data: "newResurs" }],
              [{ text: "Tarif Rejasini yaratish", callback_data: "newTarif" }],
            ],
          },
        }
      );
    }
  }
});
Connection.action("newTarif", async (ctx: any) => {
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
  return ctx.wizard.next();
});

const tarif = new Composer();
tarif.on("callback_query", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const data = ctx.update.callback_query.data;
  const user = await User.findOne({ telegramId: id, activ: true });
  const proyektOp = await proyekt.findAll({
    where: {
      userId: user.id,
      activ: true,
    },
    order: [["createdAt", "DESC"]],
  });
  const proyektId = proyektOp[0].dataValues.id;
  const tarif = await Tarif.create({
    userId: user.id,
    proyektId,
    currency: data,
  });
  console.log(tarif);
  if (tarif) {
    await ctx.telegram.editMessageText(
      id,
      messageId,
      updateId,
      "2/5 Tarif nomini kiriting"
    );
    return ctx.wizard.next();
  }
});

const tarifName = new Composer();
tarifName.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const text = ctx.update.message.text;
  const user = await User.findOne({ telegramId: id, activ: true });
  const tarifOp = await Tarif.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  console.log(tarifOp);
  const tarifId = tarifOp[0]?.dataValues.id;
  if (!tarifId) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }
  const tarif = await Tarif.update(
    {
      name: text,
    },
    {
      where: {
        id: tarifId,
      },
    }
  );
  const data = await Tarif.findOne({ where: { id: tarifId } });

  await ctx.telegram.sendMessage(
    id,
    `Tarif nomi muvaffaqiyatli saqlandi <b>${text}</b>\nTarif summasini kiriting (min: 1000 ${data.currency})`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Proyektni Bekor qilish",
              callback_data: "cancel",
            },
          ],
        ],
      },
    }
  );
  return ctx.wizard.next();
});
const currency = new Composer();

currency.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const text = ctx.update.message.text;
  if (!Number(text)) {
    return await ctx.telegram.sendMessage(id, "Iltimos son kiriting");
  }
  console.log(cli.red(text));
  const user = await User.findOne({ telegramId: id, activ: true });
  const tarifOp = await Tarif.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  const tarifId = tarifOp[0].dataValues.id;

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
  const user = await User.findOne({ telegramId: id, activ: true });
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
  const name = channel.name;
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    `Tarif rejasi tasdiqlandi va <b>${name}</b> kanaliga ulandi`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Tasdiqlash", callback_data: "confirm" }],
          [{ text: "Bekor qilish", callback_data: "cancel" }],
        ],
      },
    }
  );
  return ctx.wizard.next();
});

const botConfirm = new Composer();

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
  // return ctx.scene.next();
});
botConfirm.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  console.log(ctx.update);
  console.log(message);
  const botullo = new botFather(message);
  botullo.start();
  return ctx.wizard.next();
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
  const name =
    ctx.update.message.from.username || ctx.update.message.from.first_name;
  const id = ctx.update.message.from.id;

  let user = await User.findOne({
    where: {
      telegramId: id,
    },
  });
  console.log(user);
  if (!user) {
    user = await User.create({
      username: name,
      telegramId: id,
    });
  } else {
    // await User.update({ username: name }, { where: { telegramId: id } });
  }
  console.log(user);

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
  ctx.scene.enter("sceneWizard");
});

bot.on("text", async (ctx: any) => {
  console.log(ctx.update);
});
bot.on("my_chat_member", async (ctx: any) => {
  console.log(ctx.update.my_chat_member);
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
  console.log(test);
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
