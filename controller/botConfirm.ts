import fs from "fs";
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
    "Выберите валюту",
    {
      reply_markup: {
        inline_keyboard: dataArr,
      },
    }
  );
  return ctx.wizard.selectStep(5);
};

const Cancel = async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Список ваших проектов: \n",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Создать новый проект",
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
    const text = `Теперь вам нужно подключить своего личного бота, с которым будут общаться ваши подписчики.\nДля этого:\n1. Откройте отца ботов - @BotFather\n2. Создайте нового бота (command/newbot)\n3. Отец отправит вам токен API вашего пользовательского бота (формат 123456789:ASDFABC-DEF1234gh) — скопируйте этот токен и отправьте мне.\nВажно! Не используйте бота, подключенного к другому сервису (или других ботов)!\nЯ жду токен...`;
    await ctx.telegram.editMessageText(id, messageId, updateId, text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Отмена проекта", callback_data: "cancel" }],
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
