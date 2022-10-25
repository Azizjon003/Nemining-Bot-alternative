const Money = async (ctx: any) => {
  const text = `ℹ️ <i>Если вы ошиблись на каком-то этапе - пройдите все этапы создания проекта.
  Затем вы можете изменить любой параметр.</i>
  <b>Введите новое название проекта:
  Пример => Проект:Имя
  </b>`;
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Отмена", callback_data: "cancel" }]],
    },
  });
  return ctx.wizard.next();
};

const Donat = async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const text = `ℹ️ <i>Проект в процессе...</i>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Отмена", callback_data: "cancel" }]],
    },
  });
  return ctx.wizard.next();
};
const Cancels = async (ctx: any, User: any) => {
  // console.log(ctx);
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  await User.update(
    {
      editTarif: null,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Вы находитесь в главном меню",
    {}
  );
  return ctx.wizard.selectStep(0);
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
  const text = `Название тарифа <code>${datas?.name}</code>\n Валюта тарифа <code>${datas.currency}</code>\n Срок действия тарифа <code>${datas.expires}</code>\n Тарифная цена <code>${datas.price}</code>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Переименовать",
            callback_data: `name:${datas.id}`,
          },
          {
            text: "Изменить цену",
            callback_data: `price:${datas.id}`,
          },
          {
            text: "Изменить время",
            callback_data: `time:${datas.id}`,
          },
        ],
        [
          {
            text: "Отмена",
            callback_data: `cancel`,
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
  const text = `Введите новое имя`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Отмена",
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
  const text = `Введите новую цену\n Текущая цена: <code>${datas.price}</code>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Отмена", callback_data: "cancel" }]],
    },
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
  const text = `Текущий срок действия: <code>${datas.expires}</code>\n Введите новый срок действия (введите срок действия в часах)`;

  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Отмена", callback_data: "cancel" }]],
    },
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
