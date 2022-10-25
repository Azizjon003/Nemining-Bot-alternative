const calBack = async (ctx: any, User: any, proyekt: any, Tarif: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const data = ctx.update.callback_query.data;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const proyektOp = await proyekt.findAll({
    where: {
      userId: user.id,
      activ: true,
    },
    order: [["createdAt", "DESC"]],
  });
  console.log(proyektOp);
  const proyektId = proyektOp[0].dataValues.id;
  const tarif = await Tarif.create({
    userId: user.id,
    proyektId,
    currency: data,
  });
  console.log(tarif);
  if (tarif) {
    await ctx.telegram.editMessageText(
      id,
      messageId,
      updateId,
      "2/5 Введите название тарифа"
    );
    return ctx.wizard.next();
  }
};

module.exports = {
  calBack,
};
