import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const text = ``;
const TOKEN = String(process.env.TOKEN);
const bot = new Telegraf(TOKEN);
bot.start((ctx) => {
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
});

bot.action(/newproyekt/g, (ctx) => {
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
  console.log(ctx.telegram);
});

bot.action("money", async (ctx) => {
  const text = `ℹ️ <i>Agar biror bosqichda xatoga yo'l qo'ysangiz - loyiha yaratishning barcha bosqichlaridan o'ting.
  Keyin har qanday sozlamani o'zgartirishingiz mumkin.</i>
  
  <b>Yangi loyiha nomini kiriting:</b>`;
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
});
bot.action("donat", async (ctx) => {
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
});
bot.action("channel", async (ctx) => {
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
      inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]],
    },
  });
});
bot.action("cancel", async (ctx) => {
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

  // ctx.telegram.editMessageReplyMarkup(id,messageId,,);
  // await ctx.deleteMessage();
});
bot.on("text", (ctx) => {
  console.log(ctx.update.message);
  const id = ctx.update.message.from.id;
  const text = ctx.update.message.text;
  const updateId = ctx.update.message.from;
  console.log(updateId);
  const messageId = ctx.update.message.message_id;
  const textMain = `💁‍♀️ Loyiha: ${text}

  Endi birinchi resursingizni ulang.
  
  Siz ham shaxsiy kanal, ham shaxsiy guruh qo'shishingiz mumkin.
  
  Nimani bog'laysiz?`;
  ctx.telegram.sendMessage(id, textMain, {
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
bot.hears(/P|proyektlar/g, (ctx) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  ctx.telegram.sendMessage(id, "Sizning loyihalaringiz ro'yxati: \n", {
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
});
bot.hears(/Y|yordam/g, (ctx) => {
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(
    id,
    `NEMILIN BOT\n\n<i>Qo'llab-quvvatlash:</i> @Coder_aa\n\n<i>Rasmiy kanal:</i> @musicsnewsuz\n\n<i>Sizning ID raqamingiz:</i> <code>${id}</code>`,
    {
      parse_mode: "HTML",
    }
  );
});
bot.on("forward_date", (ctx) => {
  console.log(ctx);
});
console.log("Bot is running");
bot.launch();
