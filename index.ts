import { Telegraf, Composer, session, Scenes } from "telegraf";
import dotenv from "dotenv";
import cli from "cli-color";
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
  console.log(user);
  if (!user) {
    ctx.telegram.sendMessage(id, `Siz ro'yhatdan o'tmagansiz!`, {
      parse_mode: "HTML",
    });
  }
  let text = "";
  const userProyekt = await proyekt.findAll({
    where: { userId: user.id, activ: true },
  });
  console.log(userProyekt);
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
  return ctx.wizard.next();
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
  console.log(ctx);
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
  return ctx.wizard.back();

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
  ctx.telegram.sendMessage(id, textMain, {
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
  console.log(ctx);
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
  return ctx.wizard.next();
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
Connection.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  console.log(ctx.update);
  const forward = ctx.update.message.forward_from_chat as forward_from;

  if (!forward.username) {
    ctx.deleteMessage(messageId);
    ctx.telegram.sendMessage(
      id,
      "Kanalni ulamoqchi bo'lyapsizmi ulamoqchi bo'lyapsizmi sizning kallangiz bormi?"
    );
  }
});
const menuSchema: any = new Scenes.WizardScene(
  "sceneWizard",
  newWizart,
  newProyekt,
  proyektOption,
  option,
  Connection
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

bot.on("my_chat_member", async (ctx: any) => {
  console.log(ctx.update.my_chat_member);
  const userId = ctx.update.my_chat_member.from.id;
  const chatId = ctx.update.my_chat_member.chat.id;
  const test = ctx.update.my_chat_member.new_chat_member.status;
  const name = ctx.update.my_chat_member.from.username;
  const chatType = ctx.update.my_chat_member.chat.type;
  const user = await User.findOne({
    where: { telegramId: userId },
  });
  if (!user) {
    ctx.telegram.sendMessage(chatId, `Siz ro'yxatdan o'tmadingiz!`);
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
  if (test == "administrator") {
    const chanel = await Channel.create({
      name: name,
      telegramId: chatId * 1,
      type: chatType,
      userId: userId.id,
    });
    console.log(chanel);
  }
});
console.log("Bot is running");
bot.launch();
