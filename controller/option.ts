const TextFunction = async (ctx: any, User: any, proyekt: any) => {
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
};
const Cancel = async (ctx: any) => {
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
};

const Channel = async (ctx: any) => {
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
};
const Group = async (ctx: any) => {
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
};

const Back = async (ctx: any) => {
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
  return ctx.wizard.back();
};

module.exports = {
  TextFunction,
  Cancel,
  Group,
  Channel,
  Back,
};
