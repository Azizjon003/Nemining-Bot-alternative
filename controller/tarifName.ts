// bot.hears("group", async (ctx: any) => {
//   console.log(cli.red("Dsgvdkjasg"));
//   console.log(ctx.update);
//   const id = ctx.update.message.from.id;
//   const messageId = ctx.update.message.message_id;
//   const title = ctx.update.message.chat.title;
//   const groupId = ctx.update.message.chat.id;
//   const username = ctx.update.message.chat?.username;
//   if (username) {
//     return await ctx.reply("Ommaviy guruhi ulab bo'lmaydi");
//   }
//   const user = await User.findOne({ where: { telegramId: id, activ: true } });
//   const ProyektOp = await proyekt.findOne({
//     where: { userId: user?.id },
//     order: [["createdAt", "DESC"]],
//   });
//   const proyektId = ProyektOp[0]?.dataValues.id;
//   const group = await Channel.findOne({
//     where: { name: title, userId: user.id, activ: true },
//   });
//   if (!group) {
//     return await ctx.reply("Ulangan guruh topilmadi");
//   }
//   const groupOp = await Channel.update(
//     {
//       proyektId: proyektId,
//     },
//     {
//       where: { name: title, userId: user.id, activ: true },
//     }
//   );

//   const data = await Channel.findOne({
//     where: {
//       name: title,
//     },
//   });
//   if (data) {
//     await ctx.telegram.sendMessage(
//       id,
//       `Siz muvaffaqiyatli ulandingiz
//     ${data.name} Guruhi.

//     Boshqa resurs qo'shing yoki tarif rejasini yaratishni davom eting:
//     tegishli tugmani bosing.`,
//       {
//         reply_markup: {
//           inline_keyboard: [
//             [{ text: "Tarif Rejasini yaratish", callback_data: "newTarif" }],
//             [{ text: "Bekor Qilish", callback_data: "cancel" }],
//           ],
//         },
//       }
//     );
//   }
//   ctx.scene.enter("sceneWizard");
// });

const textFunc = async (ctx: any, User: any, Tarif: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const text = ctx.update.message.text;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  console.log(user.id);
  const tarifOp = await Tarif.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  console.log(tarifOp);
  const tarifId = tarifOp[0]?.dataValues.id;
  if (!tarifId) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }

  console.log(tarifId);
  const tarif = await Tarif.update(
    {
      name: text,
    },
    {
      where: {
        id: tarifId,
      },
    }
  );
  const data = await Tarif.findOne({ where: { id: tarifId } });
  console.log("M kalla tarif");
  console.log(data);

  await ctx.telegram.sendMessage(
    id,
    `Название тарифа успешно сохранено <b>${text}</b>\nВведите сумму тарифа (мин.: 1000 ${data.currency})`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Отмена проекта",
              callback_data: "cancel",
            },
          ],
        ],
      },
    }
  );
  return ctx.wizard.next();
};

module.exports = {
  textFunc,
};
