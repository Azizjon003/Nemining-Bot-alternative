const newProject = async (ctx: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;

  const id = ctx.update.callback_query.from.id;

  const text = `💁🏻‍♂️ Siz qanday loyiha yaratmoqchisiz?\n- Pulli obuna: shaxsiy kanal yoki guruhingizga pullik obunani tashkil qilish\n- Donat: Donat qabul qilishni tashkil etish`;

  ctx.telegram.callB;
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
};

const xatolar = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const txt = ctx.update.message.text;
  if (txt == "/start") {
    return ctx.scene.leave();
  }
  const text = `Bunaqa buyruq mavjud emas!.Loyiha yaratish uchun /start ni bosing`;
  await ctx.telegram.sendMessage(id, text, {});
};

module.exports = {
  newProject,
  xatolar,
};
