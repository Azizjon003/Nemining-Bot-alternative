const xato = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const txt = ctx.update.message.text;
  console.log(ctx.update);
  if (
    txt == "Помощь" ||
    txt == "Проекты" ||
    txt == "Платежи" ||
    txt == "Настройки"
  ) {
    return ctx.wizard.selectStep(0);
  }
  if (txt == "/start") {
    return;
  }
  const text = `Такой команды не существует!`;
  await ctx.telegram.sendMessage(id, text, {});
};

module.exports = xato;
