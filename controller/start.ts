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

  ctx.telegram.sendMessage(
    id,
    `🖐 Xush kelibsiz, ${name}! Kanalni monetizatsiya qilish haqida o'ylab ko'rganmisiz? Yoki xayr-ehsonlarni ulashni xohlaysizmi? :)`,
    {
      reply_markup: {
        keyboard: [
          [{ text: "Proyektlar" }, { text: "To'lovlar" }],
          [{ text: "Sozlamalar" }, { text: "Yordam" }],
        ],
        resize_keyboard: true,
      },
    }
  );
  return ctx.scene.enter("sceneWizard");
};

module.exports = {
  start,
};
