const callBack = async (ctx: any, User: any, Tarif: any, Channel: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const data = ctx.update.callback_query.data;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const tarifOp = await Tarif.findAll({ where: { userId: user.id } });
  const tarifId = tarifOp[0].dataValues.id;
  if (!tarifId) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }
  console.log(data);
  console.log(tarifId);
  const tarif = await Tarif.update(
    {
      expires: data,
    },
    {
      where: {
        id: tarifId,
      },
    }
  );
  console.log(tarif);
  if (!tarif) {
    return await ctx.telegram.sendMessage(
      id,
      "Произошла ошибка при создании тарифного плана"
    );
  }
  const channel = await Channel.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  console.log(channel);
  const name = channel?.name;

  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    `Тарифный план утвержден и подключен к каналу <b>${name}</b>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Добавить другой тарифный план",
              callback_data: "newtarif",
            },
          ],
          [{ text: "Подтверждение", callback_data: "confirm" }],
          [{ text: "Отмена", callback_data: "cancel" }],
        ],
      },
    }
  );
  return ctx.wizard.next();
};

module.exports = { callBack };
