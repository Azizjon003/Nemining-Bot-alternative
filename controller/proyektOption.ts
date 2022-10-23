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
  const data = ctx.update.callback_query.data.split(":")[1];
  const datas = await Tarif.findOne({
    id: data,
  });
  const text = `Tarif nomi <code>${datas?.name}</code>\n Tarif currency <code>${datas.currency}</code>\n Tarif amal qilish muddati <code>${datas.expires}</code>\n Tarif narxi <code>${datas.price}</code>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Nomini O'zgartirish",
            callback_data: `name:${datas.id}`,
          },
          {
            text: "Narxini O'zgartirish",
            callback_data: `price:${datas.id}`,
          },
          {
            text: "Vaqtini o'zgartirish",
            callback_data: `time:${datas.id}`,
          },
        ],
      ],
    },
  });
};
const editTarifName = async (ctx: any, Tarif: any, User: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const data = ctx.update.callback_query.data.split(":")[1];
  const datas = await Tarif.findOne({
    where: {
      id: data,
    },
  });

  const edit = await User.update(
    {
      editTarif: `name:${datas.id}`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  const text = `Yangi nomni kiriting`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Bekor qilish",
            callback_data: `cancel`,
          },
        ],
      ],
    },
  });
  return ctx.wizard.selectStep(10);
};
const editTarifPrice = async (ctx: any, Tarif: any, User: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const data = ctx.update.callback_query.data.split(":")[1];
  const datas = await Tarif.findOne({
    where: {
      id: data,
    },
  });
  const edit = await User.update(
    {
      editTarif: `price:${datas.id}`,
    },
    {
      where: {
        id: data,
      },
    }
  );
  const text = `Yangi narxni kiriting\n Hozirgi Narx: <code>${datas.price}</code>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
  });
  return ctx.wizard.selectStep(10);
};
const editTarifTime = async (ctx: any, Tarif: any, User: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const data = ctx.update.callback_query.data.split(":")[1];

  const user = await User.findOne({
    where: {
      telegramId: id,
    },
  });
  const datas = await Tarif.findOne({
    where: {
      id: data,
    },
  });
  const edit = await User.update(
    {
      editTarif: `time:${data}`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  const text = `Hozirgi Muddat: <code>${datas.expires}</code>\n Yangi Muddatni kiriting(Muddatni soatlarda kiriting)`;

  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
  });

  return ctx.wizard.selectStep(10);
};

module.exports = {
  Money,
  Donat,
  Cancels,
  editTarifOption,
  editTarifName,
  editTarifPrice,
  editTarifTime,
};
