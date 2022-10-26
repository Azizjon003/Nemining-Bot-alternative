const TextFunction = async (ctx: any, User: any, proyekt: any) => {
  const message = ctx.update.message.text;
  const id = ctx.update.message.from.id;
  const textMain = `💁‍♀️ Проект: <i>${message}</i>\nТеперь подключите свой первый ресурс.\nВы можете добавить как закрытый канал, так и закрытую группу.\nЧто вы будете связывать?`;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  if (user.editTarif == null) {
    const project = await proyekt.create({
      name: message,
      userId: user.id,
    });
    await User.update(
      {
        editTarif: project.id,
      },
      {
        where: {
          telegramId: id,
        },
      }
    );
  } else {
    return await ctx.telegram.sendMessage(id, "Вы уже создали проект");
  }
  await ctx.telegram.sendMessage(id, textMain, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Частный канал", callback_data: "channel" },
          { text: "Частная группа", callback_data: "group" },
        ],
        [{ text: "Отмена", callback_data: "cancel" }],
      ],
    },
  });
  return;
};
const Cancel = async (ctx: any, User: any) => {
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
    "Вы находитесь в главном меню \n"
  );
  return ctx.wizard.selectStep(0);

  // ctx.telegram.editMessageReplyMarkup(id,messageId,,);
  // await ctx.deleteMessage();
};

const Channel = async (ctx: any, User: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );

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
  const text = `ℹ️ <i>1. Добавьте меня @bot в админку подключенного канала\n2. Требуется разрешение Добавить участников\n3.Отправить мне любое сообщение с канала (непосредственно в этот чат).
      <b>В режиме ожидания...</b></i>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Назад", callback_data: "back" }],
        [{ text: "Отмена", callback_data: "cancel" }],
      ],
    },
  });
  // console.log(ctx.stage);
  return ctx.wizard.next({});
};
const Group = async (ctx: any, User: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
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
  const text = `ℹ️ <i>1. Добавьте меня @bot в подключенные администраторы группы\n2. Требуется разрешение Добавить участников\n3.Пришлите мне название группы (непосредственно в этот чат).
  <b>В режиме ожидания...</b></i>`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Назад", callback_data: "back" }],
        [{ text: "Отмена", callback_data: "cancel" }],
      ],
    },
  });
  // console.log(ctx.stage);
  return ctx.wizard.next({});
};

const Back = async (ctx: any, User: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );

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
  const textMain = `💁‍♀️ Проект: <i>${id}</i>
  
  Теперь подключите свой первый ресурс.

  Вы можете добавить как частный канал, так и частную группу.

  Что вы подключаете?`;
  ctx.telegram.editMessageText(id, messageId, updateId, textMain, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Частный канал", callback_data: "channel" },
          { text: "Частная группа", callback_data: "group" },
        ],
        [{ text: "Отмена", callback_data: "cancel" }],
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
