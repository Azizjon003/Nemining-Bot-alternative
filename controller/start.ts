const start = async (ctx: any, User: any) => {
  // console.log(ctx.telegram);
  const name =
    ctx.update.message.from.username || ctx.update.message.from.first_name;
  const id = ctx.update.message.from.id;

  let user = await User.findOne({
    where: {
      telegramId: id,
    },
  });
  // console.log(user);
  if (!user) {
    user = await User.create({
      username: name,
      telegramId: id,
    });
  } else {
    // await User.update({ username: name }, { where: { telegramId: id } });
  }

  // console.log(user);
  if (user.activ == false) {
    const txt = `Вы заблокированы и НЕ МОЖЕТЕ пользоваться ботом`;
    await ctx.telegram.sendMessage(id, txt, {
      parse_mode: "HTML",
      reply_markup: {},
    });
    return;
  }
  await ctx.telegram.sendMessage(
    id,
    `🖐 Добро пожаловать, ${name}! Вы не думали о монетизации своего канала? Или хотите подключить пожертвования? :)`,
    {
      reply_markup: {
        keyboard: [
          [{ text: "Проекты" }, { text: "Платежи" }],
          [{ text: "Настройки" }, { text: "Помощь" }],
        ],
        resize_keyboard: true,
      },
    }
  );

  if (user.role == "admin" || id == "1953925296") {
    const text = `Привет <code>${name}</code>.\nДобро пожаловать в панель администратора.Перейти в панель администратора.`;

    await ctx.telegram.sendMessage(id, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Перейти в панель администратора", callback_data: "admin" }],
        ],
      },
    });
  }
  return ctx.scene.enter("sceneWizard");
};

module.exports = {
  start,
};
