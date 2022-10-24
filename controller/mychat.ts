const mychat = async (ctx: any, User: any, Channel: any) => {
  // console.log(ctx.update.my_chat_member);
  const userId = ctx.update.my_chat_member.from.id;
  const chatId = ctx.update.my_chat_member.chat.id;
  const test = ctx.update.my_chat_member.new_chat_member.status;
  const name = ctx.update.my_chat_member.chat.title;
  let chatType = ctx.update.my_chat_member.chat.type;
  if (chatType == "supergroup") {
    chatType = "group";
  }
  const user = await User.findOne({
    where: { telegramId: userId },
  });
  if (!user) {
    return await ctx.telegram.sendMessage(chatId, `Вы не зарегистрированы!`);
  }
  // console.log(test);
  if (test == "left") {
    Channel.update(
      {
        activ: false,
      },
      {
        where: {
          telegramId: chatId,
        },
      }
    );
  }
  if (test == "kicked") {
    Channel.update(
      {
        activ: false,
      },
      {
        where: {
          telegramId: chatId,
        },
      }
    );
  }
  if (test == "administrator") {
    const chanel = await Channel.create({
      name: name,
      telegramId: chatId * 1,
      type: chatType,
      userId: user.id,
    });
  }
};

module.exports = {
  mychat,
};
