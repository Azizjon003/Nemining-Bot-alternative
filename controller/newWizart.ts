const Yordam = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(
    id,
    `NEMILIN BOT\n\n<i>Поддержка:</i> @Coder_aa\n\n<i>Официальный канал:</i> @musicsnewsuz\n\n<i>Ваш идентификационный номер:</i> <code >${id}</code>`,
    {
      parse_mode: "HTML",
    }
  );
  // ctx.scene.enter("sceneWizard");
};
const Proyektlar = async (ctx: any, User: any, proyekt: any) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  if (!user) {
    ctx.telegram.sendMessage(id, `Вы не зарегистрированы!`, {
      parse_mode: "HTML",
    });
  }

  let text = "";
  const userProyekt = await proyekt.findAll({
    where: { userId: user.id, activ: true },
  });
  // console.log(userProyekt);
  for (let i = 0; i < userProyekt.length; i++) {
    text =
      userProyekt[i].dataValues.id +
      ": " +
      String(userProyekt[i].dataValues.name) +
      "\n" +
      text;
  }
  await ctx.telegram.sendMessage(
    id,
    `Список ваших проектов: <i>${text || ""}</i> \n`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Создать новый проект",
              callback_data: `newproyekt`,
            },
          ],
          [
            {
              text: "Изменить проекты",
              callback_data: "editproyekt",
            },
          ],
          [
            {
              text: "Отмена",
              callback_data: "cancel",
            },
          ],
        ],
      },
    }
  );
  return ctx.wizard.next();
};
const Tolovlar = async (ctx: any, User: any, Payment: any) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const payment = await Payment.findOne({
    where: {
      id: user.paymentId,
    },
  });
  if (payment) {
    await ctx.telegram.sendMessage(
      id,
      `Ваш платеж доступен!!!;\n Тарифы:${payment.tarif}\n номер карты: ${payment.cardNum}\n Email: ${payment.email}\n`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Изменять", callback_data: `update${payment.id}` }],
            [{ text: "Отмена", callback_data: `cancel` }],
          ],
          remove_keyboard: true,
        },
      }
    );
    return ctx.wizard.selectStep(12);
  }
  const text = `<i> Мы начали.Вы отправляете нам необходимый текст.То есть вводите свой <code>номер карты</code>тариф</i>`;

  const upt = await User.update(
    {
      editTarif: `payment:name`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  ctx.telegram.sendMessage(id, text, {
    parse_mode: "HTML",
  });
  return ctx.wizard.selectStep(12);
};
const Sozlamalar = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const text = `<i>Раздел настроек еще не запущен! Запустим в ближайшее время</i>`;
  ctx.telegram.sendMessage(id, text, {
    parse_mode: "HTML",
  });
};
module.exports = {
  Yordam,
  Proyektlar,
  Tolovlar,
  Sozlamalar,
};
