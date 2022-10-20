import fs from "fs";
const Cancel = async (ctx: any) => {
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
  return ctx.wizard.back().back().back().back().back();
};
const textFunc = async (ctx: any, User: any, Tarif: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const text = ctx.update.message.text;
  if (!Number(text)) {
    return await ctx.telegram.sendMessage(id, "Iltimos son kiriting");
  }
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  console.log(user.id);
  const tarifOp = await Tarif.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  const tarifId = tarifOp[0].dataValues.id;
  console.log(tarifId);
  if (!tarifId) {
    return await ctx.telegram.sendMessage(
      id,
      "Tarif rejasini yaratishda xatolik yuz berdi"
    );
  }
  console.log(tarifId);
  const tarif = await Tarif.update(
    {
      price: text,
    },
    {
      where: {
        id: tarifId,
      },
    }
  );

  const dataArr = JSON.parse(fs.readFileSync("../date.json", "utf-8"));
  console.log(dataArr);
  await ctx.telegram.sendMessage(
    id,
    "Tarif summasi muvaffaqiyatli saqlandi,Siz Kerakli vaqtni tanlang",
    {
      reply_markup: {
        inline_keyboard: dataArr,
      },
    }
  );
  return ctx.wizard.next();
};

module.exports = {
  textFunc,
  Cancel,
};
