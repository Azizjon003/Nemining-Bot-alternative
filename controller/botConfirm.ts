import fs from "fs";
const newTarif = async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const dataArr = JSON.parse(fs.readFileSync("../currency.json", "utf-8"));
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
  return ctx.wizard.back().back().back().back();
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
  return ctx.wizard.back().back().back().back().back().back();
};

const callBack = async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const data = ctx.update.callback_query.data;
  if (data == "confirm") {
    const text = `Endi siz obunachilaringiz muloqot qiladigan shaxsiy botingizni ulashingiz kerak.\nBuning uchun:\n1. Botlarning otasini oching - @BotFather\n2. Yangi bot yarating (buyruq/newbot)\n3. Ota sizga shaxsiy botingizning API tokenini yuboradi (format 123456789:ASDFABC-DEF1234gh) - bu tokenni nusxalab, menga yuboring.\nMuhim! Boshqa xizmatga (yoki boshqa botlarga) ulangan botdan foydalanmang!\nMen tokenni kutyapman...`;
    await ctx.telegram.editMessageText(id, messageId, updateId, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Loyihani Bekor Qilish", callback_data: "cancel" }],
        ],
      },
    });
  }
  // return ctx.wizard.next();
};
module.exports = {
  newTarif,
  callBack,
};
