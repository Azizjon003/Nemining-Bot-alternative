const xato = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const txt = ctx.update.message.text;
  if (
    txt == "Помощь" ||
    txt == "Проекты" ||
    txt == "Платежи" ||
    txt == "Настройки"
    // txt == "/start"
  ) {
    return ctx.wizard.selectStep(0);
  }
  const text = `Такой команды не существует!`;
  await ctx.telegram.sendMessage(id, text, {});
};

module.exports = xato;
