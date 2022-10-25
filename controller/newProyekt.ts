const newProject = async (ctx: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;

  const id = ctx.update.callback_query.from.id;

  const text = `💁🏻‍♂️ Siz qanday loyiha yaratmoqchisiz?\n- Pulli obuna: shaxsiy kanal yoki guruhingizga pullik obunani tashkil qilish\n- Donat: Donat qabul qilishni tashkil etish`;

  ctx.telegram.callB;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Pulli obuna", callback_data: "money" },
          { text: "Donat", callback_data: "donat" },
        ],
        [{ text: "Obunani Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
  return ctx.wizard.next();
};

const xatolar = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const messageId = ctx.update.message.message_id;
  const txt = ctx.update.message.text;
  if (txt == "/start") {
    return ctx.scene.leave();
  }
  const text = `Такой команды не существует! Нажмите /start, чтобы создать проект`;
  await ctx.deleteMessage(messageId);
  await ctx.telegram.sendMessage(id, text, {});
  return ctx.wizard.selectStep(0);
};

const editProyekt = async (ctx: any, User: any, proyekt: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const id = ctx.update.callback_query.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const proyekts = await proyekt.findAll({
    where: { userId: user.id },
  });
  console.log(proyekts);

  let arr: {
    text: string;
    callback_data: string;
  }[][] = [];
  proyekts.forEach((item: any) => {
    let son = 0;
    let arrcha: {
      text: string;
      callback_data: string;
    }[] = [];
    if (son < 3) {
      arrcha.push({
        text: `${item.name}`,
        callback_data: `${item.id}`,
      });

      arr.push(arrcha);
      arrcha = [];
    } else {
      son = 0;
    }
    son++;
  });
  console.log(arr);

  arr.push([{ text: "Bekor Qilish", callback_data: "cancel" }]);

  const text = `Введите проект, который вы хотите изменить`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: arr,
    },
  });
};
const callBackFunc = async (ctx: any, User: any, proyekt: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const id = ctx.update.callback_query.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const data = ctx.update.callback_query.data;
  if (Number(data)) {
    const proyekts = await proyekt.findOne({
      where: {
        id: data,
      },
    });

    let txt = `Название проекта <b><i>${proyekts.name}</i></b>\n Статус <code>${proyekts.activ}</code>\nКакую часть вы хотите изменить?`;
    ctx.telegram.editMessageText(id, messageId, updateId, txt, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Проект номи", callback_data: `name:${proyekts.id}` },
            { text: "Статус", callback_data: `status:${proyekts.id}` },
            {
              text: "Посмотреть тарифы",
              callback_data: `tarif:${proyekts.id}`,
            },
          ],
        ],
      },
    });
  }

  if (data.includes("name")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.findOne({
      where: {
        id: proyektId,
      },
    });
    const upt = await User.update(
      {
        editTarif: proyekts.id,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    let txt = `Введите название проекта Текущее имя <code> ${proyekts.name}</code> Введите новое имя для проекта`;

    ctx.telegram.editMessageText(id, messageId, updateId, txt, {
      parse_mode: "HTML",
    });

    return ctx.wizard.selectStep(11);
  }
  if (data.includes("status")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.findOne({
      where: {
        id: proyektId,
      },
    });

    let txt = `Введите статус проекта Текущий статус ${proyekts.active}`;

    ctx.telegram.editMessageText(id, messageId, updateId, txt, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Активный", callback_data: `true:${proyekts.id}` },
            { text: "Не активный", callback_data: `false:${proyekts.id}` },
          ],
        ],
      },
    });
  }
  if (data.includes("true")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.update(
      { activ: true },
      {
        where: {
          id: proyektId,
        },
      }
    );
    await ctx.telegram.editMessageText(
      id,
      messageId,
      updateId,
      "Статус изменен"
    );
    return ctx.scene.leave();
  }
  if (data.includes("false")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.update(
      { activ: false },
      {
        where: {
          id: proyektId,
        },
      }
    );
    await ctx.telegram.editMessageText(
      id,
      messageId,
      updateId,
      "Статус изменен"
    );
    return ctx.scene.leave();
  }
};
const editName = async (ctx: any, User: any, proyekt: any) => {
  const id = ctx.update.message.from.id;
  const txt = ctx.update.message.text;
  console.log(txt);
  const name = txt.split(":")[0];
  const newName = txt.split(":")[1];
  const pro = await proyekt.findOne({
    where: {
      name: name,
    },
  });
  if (!pro) {
    await ctx.telegram.sendMessage(
      id,
      "Bunday proyekt mavjud emas,/start buyrug'ini bosing"
    );
    return ctx.scene.leave();
  }
  console.log(pro, newName);
  const newpro = await proyekt.update(
    {
      name: newName,
    },
    {
      where: {
        name: name,
      },
    }
  );

  ctx.telegram.sendMessage(id, "Название проекта изменено");
  return ctx.scene.leave();
};
const tarifEdit = async (ctx: any, User: any, proyekt: any, Tarif: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const id = ctx.update.callback_query.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const data = ctx.update.callback_query.data;
  const proyektId = data.split(":")[1];
  console.log(proyektId);
  const tarifs = await Tarif.findAll({
    where: {
      proyektId: proyektId,
    },
  });
  console.log(tarifs);
  let arr: {
    text: string;
    callback_data: string;
  }[][] = [];
  tarifs.forEach((item: any) => {
    let arrcha: { text: string; callback_data: string }[] = [];
    let son = 0;

    if (son < 3) {
      arrcha.push({
        text: String(item.name),
        callback_data: String(`tarif:${item.id}`),
      });

      arr.push(arrcha);
      arrcha = [];
    } else {
      son = 0;
      arrcha = [];
    }
    son++;
  });

  let txt = `Выберите тарифы: `;
  ctx.telegram.editMessageText(id, messageId, updateId, txt, {
    reply_markup: {
      inline_keyboard: arr,
    },
  });
  return ctx.wizard.next();
};
module.exports = {
  newProject,
  xatolar,
  editProyekt,
  callBackFunc,
  editName,
  tarifEdit,
};
