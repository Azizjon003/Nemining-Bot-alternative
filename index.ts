import { Telegraf, Composer, session, Scenes } from "telegraf";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

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
  console.log(ctx);
  const id = ctx.update.message.from.id;
  await ctx.telegram.sendMessage(id, "Sizning loyihalaringiz ro'yxati: \n", {
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
  });
  return ctx.wizard.next();
});

const newProyekt = new Composer();
newProyekt.action("newproyekt", async (ctx: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const text = `💁🏻‍♂️ Siz qanday loyiha yaratmoqchisiz?\n- Pulli obuna: shaxsiy kanal yoki guruhingizga pullik obunani tashkil qilish\n- Donat: Donat qabul qilishni tashkil etish`;
  const id = ctx.update.callback_query.from.id;
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
  console.log(ctx.update);
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
  const name = ctx.update.message.from.first_name;
  const id = ctx.update.message.from.id;
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

console.log("Bot is running");
bot.launch();
