const Money = async (ctx: any) => {
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
};

const Donat = async (ctx: any) => {
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
};
const Cancels = async (ctx: any) => {
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
  return ctx.wizard.back();

  // ctx.telegram.editMessageReplyMarkup(id,messageId,,);
  // await ctx.deleteMessage();
};

const editTarifOption = async (
  ctx: any,
  User: any,
  proyekt: any,
  Tarif: any
) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const data = ctx.update.callback_query.data;
  if (Number(data)) {
    const datas = await Tarif.findOne({
      id: data,
    });
    const text = `Tarif nomi <code>${datas?.name}</code>`;
    ctx.telegram.editMessageText(id, messageId, updateId, text, {
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
  }
};

module.exports = {
  Money,
  Donat,
  Cancels,
};
