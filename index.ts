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

const menuSchema: any = new Scenes.WizardScene(
  "sceneWizard",
  newWizart,
  newProyekt
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

// bot.hears("Proyektlar", (ctx) => {
//   console.log(ctx);
//   const id = ctx.update.message.from.id;
//   ctx.telegram.sendMessage(id, "Sizning loyihalaringiz ro'yxati: \n", {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Yangi Proyekt Yaratish",
//             callback_data: `newproyekt`,
//           },
//         ],
//       ],
//     },
//   });
//   // return ctx.wizard.next();
// });
// bot.action(/newproyekt/g, (ctx) => {
// const updateId = ctx.update.callback_query.id;
// const messageId = ctx.update.callback_query.message?.message_id;
// const text = `💁🏻‍♂️ Siz qanday loyiha yaratmoqchisiz?\n- Pulli obuna: shaxsiy kanal yoki guruhingizga pullik obunani tashkil qilish\n- Donat: Donat qabul qilishni tashkil etish`;
// const id = ctx.update.callback_query.from.id;
// ctx.telegram.editMessageText(id, messageId, updateId, text, {
//   reply_markup: {
//     inline_keyboard: [
//       [
//         { text: "Pulli obuna", callback_data: "money" },
//         { text: "Donat", callback_data: "donat" },
//       ],
//       [{ text: "Obunani Bekor qilish", callback_data: "cancel" }],
//     ],
//   },
// });
// console.log(ctx.telegram);
// });

// bot.action("money", async (ctx) => {
//   const text = `ℹ️ <i>Agar biror bosqichda xatoga yo'l qo'ysangiz - loyiha yaratishning barcha bosqichlaridan o'ting.
//   Keyin har qanday sozlamani o'zgartirishingiz mumkin.</i>

//   <b>Yangi loyiha nomini kiriting:
//   Misol => Loyiha:Nomi
//   </b>`;
//   const id = ctx.update.callback_query.from.id;
//   const updateId = String(ctx.update.callback_query.id);
//   const messageId: number = Number(
//     ctx.update.callback_query.message?.message_id
//   );
//   ctx.telegram.editMessageText(id, messageId, updateId, text, {
//     parse_mode: "HTML",
//     reply_markup: {
//       inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]],
//     },
//   });
// });
// bot.action("donat", async (ctx) => {
//   const id = ctx.update.callback_query.from.id;
//   const updateId = String(ctx.update.callback_query.id);
//   const messageId: number = Number(
//     ctx.update.callback_query.message?.message_id
//   );
//   const text = `ℹ️ <i>Loyiha Davom ettirilmoqda...</i>`;
//   ctx.telegram.editMessageText(id, messageId, updateId, text, {
//     parse_mode: "HTML",
//     reply_markup: {
//       inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]],
//     },
//   });
// });
// bot.action("channel", async (ctx) => {
//   const id = ctx.update.callback_query.from.id;
//   const updateId = String(ctx.update.callback_query.id);
//   const messageId: number = Number(
//     ctx.update.callback_query.message?.message_id
//   );
//   const text = `ℹ️ <i>1.Ulangan kanal administratorlariga meni @Nemilin_bot qo'shing\n2. Ruxsat talab qilinadi A'zolar qo'shing\n3.Menga kanaldan istalgan xabarni yuboring (to'g'ridan-to'g'ri ushbu chatga).
//   <b>Kutish Holatida...</b></i>`;
//   ctx.telegram.editMessageText(id, messageId, updateId, text, {
//     parse_mode: "HTML",
//     reply_markup: {
//       inline_keyboard: [[{ text: "Bekor qilish", callback_data: "cancel" }]],
//     },
//   });
// });
// bot.action("cancel", async (ctx) => {
//   console.log(ctx);
//   const id = ctx.update.callback_query.from.id;
//   const updateId = ctx.update.callback_query.id;
//   const messageId = ctx.update.callback_query.message?.message_id;
//   await ctx.telegram.editMessageText(
//     id,
//     messageId,
//     updateId,
//     "Sizning loyihalaringiz ro'yxati: \n",
//     {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Yangi Proyekt Yaratish",
//               callback_data: `newproyekt`,
//             },
//           ],
//         ],
//       },
//     }
//   );

//   // ctx.telegram.editMessageReplyMarkup(id,messageId,,);
//   // await ctx.deleteMessage();
// });

// bot.hears(/Y|yordam/g, (ctx) => {
// const id = ctx.update.message.from.id;
// ctx.telegram.sendMessage(
//   id,
//   `NEMILIN BOT\n\n<i>Qo'llab-quvvatlash:</i> @Coder_aa\n\n<i>Rasmiy kanal:</i> @musicsnewsuz\n\n<i>Sizning ID raqamingiz:</i> <code>${id}</code>`,
//   {
//     parse_mode: "HTML",
//   }
// );
// });

// bot.on("text", (ctx) => {
//   console.log(ctx.update.message);
//   const id = ctx.update.message.from.id;
//   let text = ctx.update.message.text;
//   if (text.includes("Loyiha:")) {
//     text = text.split(":")[1];
//     const updateId = ctx.update.message.from;
//     console.log(updateId);
//     const messageId = ctx.update.message.message_id;
//     const textMain = `💁‍♀️ Loyiha: ${text}

//   Endi birinchi resursingizni ulang.

//   Siz ham shaxsiy kanal, ham shaxsiy guruh qo'shishingiz mumkin.

//   Nimani bog'laysiz?`;
//     ctx.telegram.sendMessage(id, textMain, {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             { text: "Shaxsiy kanal", callback_data: "channel" },
//             { text: "Shaxsiy guruh", callback_data: "group" },
//           ],
//           [{ text: "Bekor qilish", callback_data: "cancel" }],
//         ],
//       },
//     });
//   }
// });

console.log("Bot is running");
bot.launch();
