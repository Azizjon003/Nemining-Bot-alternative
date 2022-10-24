import fs from "fs";
import path from "path";
const TextFunc = async (ctx: any, User: any, proyekt: any, Channel: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const forward = ctx.update.message.forward_from_chat;
  const text = ctx.update.message.text;
  if (forward) {
    if (forward.username) {
      await ctx.deleteMessage(messageId);
      return await ctx.telegram.sendMessage(
        id,
        "Ommaviy Kanalni ulay olmaysiz iltimos shaxsiy kanalni ulang"
      );
    } else {
      await ctx.deleteMessage(messageId);

      const user = await User.findOne({
        where: {
          telegramId: id,
          activ: true,
        },
      });
      const proyektOp = await proyekt.findAll({
        where: {
          userId: user.id,
          activ: true,
        },
        order: [["createdAt", "DESC"]],
      });
      const proyektId = proyektOp[0].dataValues.id;
      const channelData = await Channel.findOne({
        where: { name: forward.title, userId: user.id, activ: true },
      });
      if (channelData.proyektId) {
        return await ctx.telegram.sendMessage(
          id,
          "Bu kanal boshqa loyihaga ulangan,Boshqa kanalni ulashingiz mumkun"
        );
      }
      const channel = await Channel.update(
        {
          proyektId,
        },
        {
          where: {
            name: forward.title,
          },
        }
      );
      const data = await Channel.findOne({
        where: { name: forward.title },
      });
      if (data) {
        await ctx.telegram.sendMessage(
          id,
          `Siz muvaffaqiyatli ulandingiz
          ${data.name} kanali.
          
          Boshqa resurs qo'shing yoki tarif rejasini yaratishni davom eting:
          tegishli tugmani bosing.`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Tarif Rejasini yaratish",
                    callback_data: "newTarif",
                  },
                ],
                [{ text: "Bekor Qilish", callback_data: "cancel" }],
              ],
            },
          }
        );
      }
    }
  } else {
    const user = await User.findOne({ where: { telegramId: id, activ: true } });
    const proyektOp = await proyekt.findAll({
      where: {
        userId: user.id,
        activ: true,
      },
      order: [["createdAt", "DESC"]],
    });
    const proyektId = proyektOp[0].dataValues.id;
    const channelData = await Channel.findOne({
      where: { name: text, userId: user.id, activ: true, type: "group" },
    });
    if (!channelData) {
      return await ctx.telegram.sendMessage(id, "Bunday kanal mavjud emas");
    }

    const channel = await Channel.update(
      {
        proyektId,
      },
      {
        where: {
          id: channelData.id,
        },
      }
    );
  }

  const data = await Channel.findOne({
    where: { name: text },
  });

  if (data) {
    await ctx.telegram.sendMessage(
      id,
      `Siz muvaffaqiyatli ulandingiz
      ${data.name} Guruhi.
      
      Boshqa resurs qo'shing yoki tarif rejasini yaratishni davom eting:
      tegishli tugmani bosing.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Tarif Rejasini yaratish",
                callback_data: "newTarif",
              },
            ],
            [{ text: "Bekor Qilish", callback_data: "cancel" }],
          ],
        },
      }
    );
  }
};
const newTarif = async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const dataArr = JSON.parse(
    fs.readFileSync(__dirname + "/currency.json", "utf-8")
  );
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Valyutani tanlang",
    {
      reply_markup: {
        inline_keyboard: dataArr,
      },
    }
  );
  return ctx.wizard.next();
};
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
  return ctx.wizard.back().back().back();
};

module.exports = {
  TextFunc,
  newTarif,
  Cancel,
};
