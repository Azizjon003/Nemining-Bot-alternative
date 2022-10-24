const Yordam = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(
    id,
    `NEMILIN BOT\n\n<i>Qo'llab-quvvatlash:</i> @Coder_aa\n\n<i>Rasmiy kanal:</i> @musicsnewsuz\n\n<i>Sizning ID raqamingiz:</i> <code>${id}</code>`,
    {
      parse_mode: "HTML",
    }
  );
  // ctx.scene.enter("sceneWizard");
};
const Proyektlar = async (ctx: any, User: any, proyekt: any) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  // console.log(user);
  if (!user) {
    ctx.telegram.sendMessage(id, `Siz ro'yhatdan o'tmagansiz!`, {
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
    `Sizning loyihalaringiz ro'yxati: <i>${text || ""}</i> \n`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Yangi Proyekt Yaratish",
              callback_data: `newproyekt`,
            },
          ],
          [
            {
              text: "Proyektlarni o'zgartirish",
              callback_data: "editproyekt",
            },
          ],
        ],
      },
    }
  );
  return ctx.wizard.next();
};
const Tolovlar = async (ctx: any, User: any) => {
  const text = `<i>Biz boshladik.Siz bizga kerakli matnni yuboring.Ya'ni siz o'zingizning<code> karta raqamingiz</code> tarifini kiriting</i>`;
  const id = ctx.update.message.from.id;

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
  const text = `<i>Sozlamalar bo'limi hozircha ishga tushirilmagan! Yaqin kunlarda ishga tushiramiz</i>`;
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
